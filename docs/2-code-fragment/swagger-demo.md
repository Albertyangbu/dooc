### Swagger单体springboot项目配置示例



> 官网访问地址 `https://doc.xiaominfo.com/`



pom引入依赖

```xml
    <dependencies>
        <dependency>
            <groupId>com.github.xiaoymin</groupId>
            <artifactId>knife4j-spring-boot-starter</artifactId>
            <version>2.0.7</version>
        </dependency>
    </dependencies>
```



配置文件示例

```yaml
knife4j:
  # 开启增强配置
  enable: true
  # 开启生产环境屏蔽
  production: false
  # 开启Swagger的Basic认证功能,默认是false
  basic:
    enable: true
    # Basic认证用户名
    username: test
    # Basic认证密码
    password: 123456
```



配置

```java
package com.ydoct.demo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.*;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2WebMvc;

import java.util.Collections;
import java.util.List;

/**
 * @describe:
 * @author: ydoct
 * @version: v1.0
 * 2021/8/5 10:43
 */
@Configuration
@EnableSwagger2WebMvc
public class Knife4jConfig {

    @Bean(value = "defaultApi2")
    public Docket defaultApi2() {
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .securitySchemes(schemes())
                .securityContexts(contexts())
                .groupName("default")
                .select()
                //这里指定Controller扫描包路径
                .apis(RequestHandlerSelectors.basePackage("com.ydoct.demo"))
                .paths(PathSelectors.any())
                .build();
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("swagger demo")
                .description("swagger 示例工程")
                .termsOfServiceUrl("")
                .contact(new Contact("ydoct", "", ""))
                .version("1.0")
                .build();
    }

    private List<SecurityScheme> schemes() {
        return Collections.singletonList(new ApiKey("token", "token", "header"));
    }

    private List<SecurityContext> contexts() {
        return Collections.singletonList(SecurityContext.builder()
                .securityReferences(defaultAuth())
                .build());
    }

    private List<SecurityReference> defaultAuth() {
        return Collections.singletonList(SecurityReference.builder()
                .reference("token").scopes(new AuthorizationScope[]{})
                .build());
    }
}
```



项目启动后，通过`http://ip:port/doc.html`即可访问