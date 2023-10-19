---
title: Consume and produce data from/to Apache Kafka using CLI
date: 2021-03-21
tags: 
  - kafka
  - consume
  - produce
  - kafka-cli
author: Adil
summary: In this series of articles we will see the different methods that we can use in order to produce data to a topic, and the way to consume it. We will start by setting up a local environment using docker and docker-compose. Once the kafka ecosystem is ready we will create a topic, than produce some data and consume it via CLI.
---

## Requirements

- [Docker](https://docs.docker.com/get-docker/).
- [Docker-compose](https://docs.docker.com/compose/).
- [OpenJDK](https://adoptopenjdk.net/installation.html).
- [jq](https://stedolan.github.io/jq/).


## Introduction

In this series of articles we will see the different methods that we can use in order to produce data to a topic, and the way to consume it. We will start by setting up a local environment using docker and docker-compose. Once the kafka ecosystem is ready we will create a topic, than produce some data and consume it via CLI.

## Local environment

Using the following `docker-compose` we will be able to start a local environment that contain: a `broker` and `zookeeper`.

docker-compose.yml

```yaml
---
version: '2'
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:6.0.0
    hostname: zookeeper
    container_name: zookeeper
    ports:
      - "2181:2181"
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000


  broker:
    image: confluentinc/cp-kafka:6.0.0
    hostname: broker
    container_name: broker
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
      - "9101:9101"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: 'zookeeper:2181'
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://broker:29092,PLAINTEXT_HOST://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
```

Start the local environment by executing this command:

```bash
$ docker-compose up -d
```

Check if the environment is ready:

```bash
$ docker-compose ps

  Name               Command            State                       Ports
----------------------------------------------------------------------------------------------
broker      /etc/confluent/docker/run   Up      0.0.0.0:9092->9092/tcp, 0.0.0.0:9101->9101/tcp
zookeeper   /etc/confluent/docker/run   Up      0.0.0.0:2181->2181/tcp, 2888/tcp, 3888/tcp
```

## Setup kafka CLI
In order to interact with the kafka broker, Apache Kafka provides a client CLI:

```sh
$ curl -L https://archive.apache.org/dist/kafka/2.6.0/kafka_2.13-2.6.0.tgz > kafka_2.13-2.6.0.tgz
$ tar -xvf kafka_2.13-2.6.0.tgz
$ cd kafka_2.13-2.6.0
$ export PATH=$PWD/bin:$PATH
$ ls -a kafka-console*                   

kafka-console-consumer.sh  kafka-console-producer.sh
```

> Add this export to your shell profile, it will allow to execute the bin from any location in the system.

## Create the topic

In order to create the topic, we will need to use `kafka-topics.sh` command and set the required parameters:

```sh
$ kafka-topics.sh \
  --bootstrap-server localhost:9092 \
  --create \
  --topic newTopic \
  --partitions 3 \
  --replication-factor 1

Created topic newTopic.
```

- `localhost:9092` - the broker address
- `newTopic` - the topic name
- `3` -  The number of partitions for topic
- `1` -  The number of replication for the topic, in our environment we have only on broker.S

To check the creation of the topic we will use the previous command with `--list` option.

```sh
$ kafka-topics.sh --bootstrap-server localhost:9092 --list

newTopic
```

To Have more details about the topic that has been creation, there is an option that we can set to `kafka-topics.sh` which is called `--describe`.

```sh
$ kafka-topics.sh --bootstrap-server localhost:9092 --describe

Topic: newTopic PartitionCount: 3       ReplicationFactor: 1    Configs:
        Topic: newTopic Partition: 0    Leader: 1       Replicas: 1     Isr: 1
        Topic: newTopic Partition: 1    Leader: 1       Replicas: 1     Isr: 1
        Topic: newTopic Partition: 2    Leader: 1       Replicas: 1     Isr: 1
```

The output of the command give us the number of partitions and the replicas.
In our case we are using only on instance for the broker which is obviously refer to the number of replicas.

> In a future article we can discuss a setup that contain a cluster with multiple brokers.

## Produce the data

Now that we have our topic created in the broker and we could describe its configuration, we can start producing messages.

In order to send messages to our topic we will use `kafka-console-producer.sh`.
An interactive prompt will be shown and we can start writing our messages.

To confirm the sending of the message we need to hit `ENTER` and continue.

Once we finish our sending we can quit the process using `CTRL+C`


```sh
$ kafka-console-producer.sh --bootstrap-server localhost:9092 --topic newTopic

>Hello world
>Bonjour monde
>Hola mundo
>^C
```

> `DETAIL`: We can start producing the data without creation of the topic. A question that we can ask ourself is the following: Why we took the time to create the topic before sending the messages? Usually in production environment the `auto-creation` for topics is disabled by default, Organizations prefer to have control and approve the creation of topics, if we want to have this behavior in our setup we can set this environment variable in our docker-compose.yml

```yaml
KAFKA_AUTO_CREATE_TOPICS_ENABLE: "false"
```

To make the production of the data more interesting we can use Meetup Streaming API.
The following endpoint will stream open events from Meetup-API:

```yaml
https://stream.meetup.com/2/open_events
```

We need to execute this command to have a continuous flow from Meetup-API

```bash
curl -s https://stream.meetup.com/2/open_events | jq -c --unbuffered '{id: .id, event_url: .event_url, name: .name}' | kafka-console-producer.sh --bootstrap-server localhost:9092 --topic newTopic
>>>>>>>>>>>
```

We execute a `GET` Request via `curl` on Meetup-API and we pipe the result to `jq` to map the output and get the following fields:
- id
- event_url
- name

For each message produced to the topic a `>` will be printed to the terminal. We keep running this command in a tab to feed our topic. We will end up having json objects in our topic that look like the following structure:

```json
{
  "id": "hfhhvqyccgbnb",
  "event_url": "https://www.meetup.com/Hamburg-Soccer-Meetup/events/hfhhvqyccgbnb/",
  "name": "Outdoor Football 8v8"
}
```

## Consume the data

In the section we will spawn a new terminal to consume the data that has been produced previously.
To do so, we will need `kafka-console-consumer.sh` binary and set the required parameters to start the consumption.

```bash
$ kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic newTopic --from-beginning

{"id":"277066021","event_url":"https://www.meetup.com/Detroit-Young-Professional-Happy-Hour/events/277066021/","name":"Make New Friends - Singles Mixer (36-47)"}
{"id":"277066034","event_url":"https://www.meetup.com/Fun-Chefs/events/277066034/","name":"New Friends - Single Professionals Mixer (36-47 group)"}
...
Processed a total of 103 messages
```

- `--from-beginning`: it allows to start consuming the data from the first offset.

We can play with this command and consume from a specific offset for a specific partition with a fixed number of messages before exiting.

```bash
$ kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 \
  --topic newTopic \
  --offset 1 \
  --partition 0 \
  --max-messages 1

{"id":"fblqfsyccgbnb","event_url":"https://www.meetup.com/Yoga-Ayurveda-Vedic-Sciences/events/fblqfsyccgbnb/","name":"Yoga in The Park"}
Processed a total of 1 messages
```

- `--offset`: rewind the process to the specified offset.
- `--partition`: consume from this specific partition.
- `--max-messages`: total messages to consume before exiting the process.

> `--offset` accepts an integer and `earliest` to start from the beginning or `latest` which the default value that mean consume from end.

To get the status of each partition we can execute this command:

```bash
$ kafka-run-class.sh kafka.tools.GetOffsetShell \
  --broker-list localhost:9092 \
  --topic newTopic

newTopic:0:34
newTopic:1:41
newTopic:2:36
```

We see clearly that our topic has 3 partitions: 0, 1 and 2 and for each partition we have the last offset that has been reached.

- partition 0 offset 34
- partition 1 offset 41
- partition 2 offset 36

## Conclusion

As you have seen put in place a Kafka local environment is accessible to every developer that is interested to get in Streaming world. In a few minutes, we manage to setup the cluster and start producing and consuming the data.

For testing purpose working with the CLI is fine and allows to prototype quickly.
But for production application the Favorite way of producing/consuming the data is via a programming language of or using kafka connector. In the next article we will discuss how we can implement it via the Java SDK.

Stay tuned ✌!