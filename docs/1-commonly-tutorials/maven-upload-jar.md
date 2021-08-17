## Maven上传jar到私服

本地上传jar到私服
```bash
mvn deploy:deploy-file -DgroupId=com.yb -DartifactId=yb-commons -Dversion=1.0-RELEASE -Dpackaging=jar -Dfile=yb-commons-1.0-TEST-RELEASE.jar -Durl=http://localhost:8081/repository/maven-releases/ -DrepositoryId=admin
```