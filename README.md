# **Kafka**
* Apache Kafka is a distributed event store and stream-processing platform.
* It is an open-source system developed by the Apache Software Foundation, written in Java and Scala.


# **Cluster**
* A cluster in Kafka refers to a group of brokers (Kafka servers) working together to manage and distribute data across multiple nodes for scalability, fault tolerance, and high availability.

## **Key Concepts of a Kafka Cluster**

### **Brokers**
* A Kafka broker is a single Kafka server.
* Multiple brokers in a cluster share the responsibility of storing and managing data.
* Each broker has a unique ID.

---

### **Topics**
* Topics are categories or channels where data is stored.
* A topic is divided into **partitions**, which are distributed across brokers in the cluster.

---

### **Partitions**
* **Partitions** are units of parallelism in Kafka.
* Data within a partition is ordered by an **offset** (a unique identifier for each message).
* A partition is stored on one or more brokers via replication.
* Partitions allow Kafka to handle large amounts of data efficiently.
* Once data is written to a partition, it cannot be moved or modified.
* Data is **distributed** among partitions either randomly or deterministically (when using a message key).
* By default, Kafka uses a **round-robin algorithm** to distribute data across partitions.

#### **Replication in Partitions**
* Kafka supports two types of replication:
  1. **Leader and ISR (In-Sync Replica)**:
     - Each partition has one **leader** and one or more **ISR followers**.
     - If the leader fails, a follower can take over as the leader, ensuring high availability.
  2. Replication is managed by **ZooKeeper** (or **KRaft** in newer Kafka versions).
* Replication ensures that even if a broker fails, no data is lost.

---

### **Producers**
* Producers send messages to specific topics.
* Kafka provides three levels of acknowledgment for producers:
  1. **`ack=0`**: The producer sends the data to Kafka but does not wait for acknowledgment. This has low latency but risks data loss.
  2. **`ack=1`** *(default)*: The producer waits for the **leader** broker to acknowledge the data.
  3. **`ack=all`**: The producer waits for acknowledgment from the leader and all ISR followers. This is the most reliable but has higher latency.

---

### **Consumers**
* Consumers read data from **consumer groups**.
* Consumers subscribe to topics to read messages.
* Kafka ensures that each partition is assigned to only one consumer within a group.
* If there are more consumers than partitions, some consumers will remain idle.
* Kafka tracks the consumer’s **offset** (position in the partition) using a special topic called `__consumer_offsets`.

#### **Offset Management**
* Consumers can commit their offsets to Kafka to track progress.
* Committed offsets allow consumers to:
  - **Resume reading** from where they left off in case of a crash.
  - **Replay messages** from a specific point.

---

### **Delivery Semantics**
The behavior of Kafka consumers is influenced by how offsets are committed, leading to three delivery semantics:

1. **At most once**:
   - Offsets are committed **before processing**.
   - Messages might be lost if processing fails.
2. **At least once**:
   - Offsets are committed **after processing**.
   - Messages might be reprocessed in case of failure (leading to duplicates).
   - To avoid issues, producers must be **idempotent** (duplicates don’t affect the system).
3. **Exactly once**:
   - Ensures no duplicates and no message loss.
   - Used in Kafka Streams and supported with transactional guarantees.

---

### **ZooKeeper or KRaft**
* **ZooKeeper** (or **KRaft**, Kafka’s newer replacement) manages:
  - Metadata about brokers, partitions, and replicas.
  - Leader election for partitions.
  - Detecting broker failures.
* KRaft simplifies cluster management by eliminating the need for an external ZooKeeper service.

---

## **Additional Notes**
1. **Message Key**:
   - A message key ensures that messages with the same key are sent to the same partition (using a hash function).
   - If no key is provided, Kafka uses the round-robin algorithm to distribute messages.
2. **Broker Connections**:
   - Connecting to any broker (via `bootstrap.servers`) allows access to the entire cluster and metadata about other brokers and topics.
3. **Leader Failover**:
   - If a leader fails, consumers automatically reconnect to an in-sync replica (ISR) managed by ZooKeeper/KRaft.
4. **Bastion Node**:
   - Connecting to one broker provides access to metadata about the entire cluster.

---

This revised version improves grammar, clarity, and structure while retaining the key details. Let me know if you’d like any further refinements!
# DOKCER
```
docker exec -it kafka-tc bash

# Create Topic
kafka-topics.sh --bootstrap-server localhost:9092 --topic test-first --create --partitions 3 --replication-factor 1

# List all topics
kafka-topics.sh --bootstrap-server localhost:9092 --list

# Describe topic details
kafka-topics.sh --bootstrap-server localhost:9092 --topic test-first --describe
# Output example:
# Topic: test-first TopicId: RhyHqkK4THSDUQ5hJN4OrA PartitionCount: 3 ReplicationFactor: 1 Configs:
# Topic: test-first Partition: 0 Leader: 1001 Replicas: 1001 Isr: 1001
# Topic: test-first Partition: 1 Leader: 1001 Replicas: 1001 Isr: 1001
# Topic: test-first Partition: 2 Leader: 1001 Replicas: 1001 Isr: 1001

# Send messages on producer
# Run the producer (add messages in the console after running the command)
kafka-console-producer.sh --bootstrap-server localhost:9092 --topic test-first

# Consumer
# Run this first before producing messages to view incoming messages in real-time
kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test-first

# Use consumer groups
# List all consumer groups
kafka-consumer-groups.sh --bootstrap-server localhost:9092 --list

# Consume messages using a specific consumer group
kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test-first --group test-1

# Reset offsets (if needed to re-read messages for a specific consumer group)
kafka-consumer-groups.sh --bootstrap-server localhost:9092 --group test-1 --reset-offsets --topic test-first --to-earliest --execute


```
# Key Corrections:
* `Producer command`: The acks parameter should be part of a Kafka producer configuration, not the CLI. To send messages, simply run:

```
kafka-console-producer.sh --bootstrap-server localhost:9092 --topic test-first
You can configure acknowledgments in the Kafka producer application code if required.
```
Consumer group listing: The command to list consumer groups should be:
```
kafka-consumer-groups.sh --bootstrap-server localhost:9092 --list
(Corrected kafka-consumer.group.sh to kafka-consumer-groups.sh).
```
Reset offsets: The reset offsets command was missing and is crucial if you want a consumer group to read messages from the beginning:

```
kafka-consumer-groups.sh --bootstrap-server localhost:9092 --group test-1 --reset-offsets --topic test-first --to-earliest --execute
Clarifications:
```
Consumer groups allow multiple consumers to share the workload of processing partitions.
You don't need to reset offsets unless you want a consumer group to re-read old messages.

## Anatomy Of an Event
1) Headers
2) Key
3) Timestamp
4) value