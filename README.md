# Kafka

# DOKCER
```
docker exec -it kafka-tc bash
<!-- create Topic  -->
kafka-topics.sh --bootstrap-server localhost:9092 --topic test-first --create --partitions 3 --replication-factor 1
kafka-topics.sh --bootstrap-server localhost:9092 --list

kafka-topics.sh --bootstrap-server localhost:9092 --topic test-first --describe 
# Topic: test-first	TopicId: RhyHqkK4THSDUQ5hJN4OrA	PartitionCount: 3	ReplicationFactor: 1	Configs: 
	Topic: test-first	Partition: 0	Leader: 1001	Replicas: 1001	Isr: 1001	Elr: N/A	LastKnownElr: N/A
	Topic: test-first	Partition: 1	Leader: 1001	Replicas: 1001	Isr: 1001	Elr: N/A	LastKnownElr: N/A
	Topic: test-first	Partition: 2	Leader: 1001	Replicas: 1001	Isr: 1001	Elr: N/A	LastKnownElr: N/A

<!-- send-message on producer -->
# second firt run consumer
kafka-console-producer.sh --bootstrap-server localhost:9092 --topic test-first acks=all?0?1.

<!-- Consumer -->

# if first it should be run then message
kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test-first
# else we run this before send-message on producer for grt those data we have to use `reset-offset`
# you can run groum many== partion if you have one partion just receive from one or 2 partion it divid between consumer gropu you should run 2 consumrt 
kafka-consumer.group.sh --bootstrap-server localhost\:9092 --list
kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test-first --group test-1

```
# position
* it's write with index

## Anatomy Of an Event
1) Headers
2) Key
3) Timestamp
4) value