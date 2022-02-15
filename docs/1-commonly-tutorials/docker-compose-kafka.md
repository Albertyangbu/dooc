### 使用docker compose部署kafka

```yaml
version: '2'
services:
  zookeeper:
    image: wurstmeister/zookeeper:latest
    container_name: zookeeper
    restart: always
    ports:
      - "2181:2181"

  kafka:
    image: wurstmeister/kafka:2.12-2.4.1
    container_name: kafka
    ports:
      - "9092:9092"
    depends_on:
      - zookeeper
    restart: always
    environment:
      KAFKA_ADVERTISED_HOST_NAME: 192.168.10.64
      KAFKA_CREATE_TOPICS: "test:1:1"
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181

  kafka-ui:
    image: provectuslabs/kafka-ui:latest
    container_name: kafka-ui
    ports:
      - "8080:8080"
    depends_on:
      - kafka
    links:
      - kafka
      - zookeeper
    restart: always
    environment:
      - KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS=kafka:9092
      - KAFKA_CLUSTERS_0_ZOOKEEPER=zookeeper:2181
```