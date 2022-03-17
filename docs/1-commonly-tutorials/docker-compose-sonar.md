### 使用docker compose安装sonar

```Bash
# 创建目录
mkdir -p /opt/sonarqube/{conf,data,logs,extensions}
mkdir -p /opt/postgres/{postgresql,data}
chmod -R 777 /opt/sonarqube
# 修改配置
# 在 /etc/sysctl.conf文件最后添加一行
vm.max_map_count=262144
# 使之生效
sysctl -p

```


```YAML
version: '3'
services:
  postgres:
    image: postgres:12
    restart: always
    container_name: postgres
    ports:
      - 5432:5432
    volumes:
      - /opt/postgres/postgresql/:/var/lib/postgresql
      - /opt/postgres/data/:/var/lib/postgresql/data
    environment:
      TZ: Asia/Shanghai
      POSTGRES_USER: sonar
      POSTGRES_PASSWORD: sonar
      POSTGRES_DB: sonar
    networks:
      - sonar-network
  sonar:
    image: sonarqube:8.2-community
    restart: always
    container_name: sonar
    depends_on:
      - postgres
    volumes:
      - /opt/sonarqube/extensions:/opt/sonarqube/extensions
      - /opt/sonarqube/logs:/opt/sonarqube/logs
      - /opt/sonarqube/data:/opt/sonarqube/data
      - /opt/sonarqube/conf:/opt/sonarqube/conf
    ports:
      - 9000:9000
    environment:
      SONARQUBE_JDBC_USERNAME: sonar
      SONARQUBE_JDBC_PASSWORD: sonar
      SONARQUBE_JDBC_URL: jdbc:postgresql://postgres:5432/sonar
    networks:
      - sonar-network
networks:
  sonar-network:
    driver: bridge

```

#### 使用maven分析代码

#### 项目根pom文件增加配置

```XML
<properties>
  <sonar.host.url>http://192.168.10.77:9000</sonar.host.url>
  <sonar.login>35198a0ebfaae5623921c7c7a5cc28114530211b</sonar.login>
</properties>
```


```XML
<build>
  <pluginManagement>
    <plugins>
      ......
      <plugin>
        <groupId>org.sonarsource.scanner.maven</groupId>
        <artifactId>sonar-maven-plugin</artifactId>
        <version>3.6.0.1398</version>
      </plugin>
    </plugins>
  </pluginManagement>
</build>
```



