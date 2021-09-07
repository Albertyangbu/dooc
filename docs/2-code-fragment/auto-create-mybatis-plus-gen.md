## MybatisPlus自动生成代码

> 使用`MybatisPlus`的`mybatis-plus-generator`模块生成 entity、mapper、service、controller代码


引入pom依赖

```xml
<dependencies>
	<dependency>
		<groupId>com.baomidou</groupId>
		<artifactId>mybatis-plus-generator</artifactId>
		<version>3.4.1</version>
	</dependency>
	<!-- 使用freemarker模版引擎 -->
	<dependency>
		<groupId>org.freemarker</groupId>
		<artifactId>freemarker</artifactId>
		<version>2.3.31</version>
	</dependency>
	<!-- mysql -->
	<dependency>
		<groupId>mysql</groupId>
		<artifactId>mysql-connector-java</artifactId>
		<version>8.0.22</version>
	</dependency>
	<!-- 实体类增加swagger注解 -->
	<dependency>
		<groupId>com.github.xiaoymin</groupId>
		<artifactId>knife4j-spring-boot-starter</artifactId>
		<version>2.0.7</version>
	</dependency>
	<!-- 使用lombok自动生成get、set -->
	<dependency>
		<groupId>org.projectlombok</groupId>
		<artifactId>lombok</artifactId>
		<optional>true</optional>
	</dependency>
	<!-- hutool工具类 -->
	<dependency>
		<groupId>cn.hutool</groupId>
		<artifactId>hutool-core</artifactId>
		<version>5.7.10</version>
	</dependency>
	<!-- 单元测试 -->
	<dependency>
		<groupId>junit</groupId>
		<artifactId>junit</artifactId>
		<version>${junit.version}</version>
		<scope>test</scope>
	</dependency>
</dependencies>
```

封装配置信息实体

```java
@Data
@Builder
public class GenVo implements Serializable {
    private static final long serialVersionUID = 6752340391268815253L;
    /**
     * 数据库用户名
     */
    private String dbUsername;
    /**
     * 数据库密码
     */
    private String dbPassword;
    /**
     * 数据库ip
     */
    private String dbIp;
    /**
     * 数据库端口
     */
    private Integer dbPort;
    /**
     * 数据库名称
     */
    private String dbName;
    /**
     * 路径
     */
    private String path;
    /**
     * 作者
     */
    private String author;
    /**
     * 是否覆盖
     */
    private boolean cover;
    /**
     * 模块路径 eg: com.bg.model
     */
    private String modelPath;
    /**
     * 模块名称
     */
    private String modelName;
    /**
     * 是否增加swagger说明
     */
    private boolean swagger;
    /**
     * 表列表
     */
    private String[] dbTables;

}
```

代码生成工具类

```java
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.generator.AutoGenerator;
import com.baomidou.mybatisplus.generator.config.*;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;
import com.baomidou.mybatisplus.generator.engine.FreemarkerTemplateEngine;
import com.bg.generator.mysql.GenVo;

public class GenDbCodeUtils {

    /**
     * 默认java路径
     */
    private static final String DEFAULT_JAVA_BASE = "/src/main/java";
    /**
     * 默认资源路径
     */
    private static final String DEFAULT_RESOURCES_BASE = "/src/main/resources";

    /**
     * 生成代码
     *
     * @param gen 代码信息
     * @author: ydoct
     * @date: 2021/8/31 14:09
     */
    public static void create(GenVo gen) {
        create(gen, getDataSource(gen));
    }

    /**
     * 生成代码
     *
     * @param gen 代码信息
     * @param ds  数据库信息
     * @author: ydoct
     * @date: 2021/8/31 14:10
     */
    public static void create(GenVo gen, DataSourceConfig ds) {
        // 生成路径
        if (StrUtil.isEmpty(gen.getPath())) {
            // 当前model项目根目录作为默认值
            gen.setPath(ModelUtils.getModelRootPath());
        }

        // 代码生成器
        AutoGenerator mpg = new AutoGenerator();

        // 全局策略器
        GlobalConfig gc = new GlobalConfig();
        gc.setOutputDir(gen.getPath() + DEFAULT_JAVA_BASE);
        gc.setAuthor(gen.getAuthor());
        gc.setOpen(false);
        gc.setSwagger2(gen.isSwagger());
        gc.setFileOverride(gen.isCover());
        // 自定义文件命名，注意 %s 会自动填充表实体属性
        gc.setControllerName("%sController");
        gc.setServiceName("%sService");
        gc.setServiceImplName("%sServiceImpl");
        gc.setMapperName("%sMapper");
        gc.setXmlName("%sMapper");
        mpg.setGlobalConfig(gc);

        // 数据源配置
        mpg.setDataSource(ds);

        // 包配置
        PackageConfig pc = new PackageConfig();
        pc.setModuleName(gen.getModelName());
        pc.setParent(gen.getModelPath());
        mpg.setPackageInfo(pc);

        // 配置模版
        TemplateConfig tc = new TemplateConfig();
        tc.setController("gentemplates/controller.java");
        tc.setEntity("gentemplates/entity.java");
        tc.setMapper("gentemplates/mapper.java");
        tc.setService("gentemplates/service.java");
        tc.setServiceImpl("gentemplates/serviceImpl.java");

        // 策略配置
        StrategyConfig sc = new StrategyConfig();
        sc.setNaming(NamingStrategy.underline_to_camel);
        sc.setColumnNaming(NamingStrategy.underline_to_camel);
        sc.setEntityLombokModel(true);
        sc.setRestControllerStyle(true);
        // 表名
        sc.setInclude(gen.getDbTables());
        mpg.setStrategy(sc);
        mpg.setTemplateEngine(new FreemarkerTemplateEngine());

        // 开始生成文件
        mpg.execute();
    }

    /**
     * 获取数据源
     *
     * @author: ydoct
     * @date: 2021/8/31 11:39
     */
    public static DataSourceConfig getDataSource(GenVo gen) {
        DataSourceConfig dsc = new DataSourceConfig();
        dsc.setDbType(DbType.MYSQL);
        dsc.setDriverName("com.mysql.cj.jdbc.Driver");
        dsc.setUsername(gen.getDbUsername());
        dsc.setPassword(gen.getDbPassword());
        dsc.setUrl("jdbc:mysql://" + gen.getDbIp() + ":" + gen.getDbPort() + "/" + gen.getDbName()
                + "?useUnicodle=true&characterEncoding=utf8&useSSL=false"
                + "&serverTimezone=UTC&allowPublicKeyRetrieval=true");
        return dsc;
    }

}
```

测试代码生成

```java
import com.bg.generator.mysql.GenVo;
import com.bg.generator.util.GenDbCodeUtils;
import org.junit.Test;

/**
 * @describe:
 * @author: ydoct
 * @version: v1.0
 * 2021/8/31 14:30
 */
public class AutoCode {

    @Test
    public void create() {
        GenVo genInfo = GenVo.builder()
                .author("ydoct").cover(true).swagger(true)
                .modelName("").modelPath("com.bg.generator")
                .dbIp("127.0.0.1").dbPort(3306).dbName("gendemo")
                .dbUsername("root").dbPassword("123456")
                .dbTables(new String[]{"sys_user"})
                .build();
        GenDbCodeUtils.create(genInfo);
    }

}
```

> 模版文件代码

<details>
<summary>controller.java.ftl</summary>

```java
package ${package.Controller};


import org.springframework.web.bind.annotation.RequestMapping;

<#if restControllerStyle>
 import org.springframework.web.bind.annotation.RestController;
<#else>
 import org.springframework.stereotype.Controller;
</#if>
<#if superControllerClassPackage??>
 import ${superControllerClassPackage};
</#if>

/**
* <p>
 * ${table.comment!} 前端控制器
 * </p>
*
* @author ${author}
* @since ${date}
*/
<#if restControllerStyle>
 @RestController
<#else>
 @Controller
</#if>
@RequestMapping("<#if package.ModuleName?? && package.ModuleName != "">/${package.ModuleName}</#if>/<#if controllerMappingHyphenStyle??>${controllerMappingHyphen}<#else>${table.entityPath}</#if>")
<#if kotlin>
 class ${table.controllerName}<#if superControllerClass??> : ${superControllerClass}()</#if>
<#else>
 <#if superControllerClass??>
  public class ${table.controllerName} extends ${superControllerClass} {
 <#else>
  public class ${table.controllerName} {
 </#if>

 }
</#if>

```
</details>
<br/>

<details>
<summary>entity.java.ftl</summary>

```java
package ${package.Entity};

<#list table.importPackages as pkg>
    import ${pkg};
</#list>
<#if swagger2>
    import io.swagger.annotations.ApiModel;
    import io.swagger.annotations.ApiModelProperty;
</#if>
<#if entityLombokModel>
    import lombok.Data;
    import lombok.EqualsAndHashCode;
    <#if chainModel>
        import lombok.experimental.Accessors;
    </#if>
</#if>

/**
* <p>
    * ${table.comment!}
    * </p>
*
* @author ${author}
* @since ${date}
*/
<#if entityLombokModel>
    @Data
    <#if superEntityClass??>
        @EqualsAndHashCode(callSuper = true)
    <#else>
        @EqualsAndHashCode(callSuper = false)
    </#if>
    <#if chainModel>
        @Accessors(chain = true)
    </#if>
</#if>
<#if table.convert>
    @TableName("${table.name}")
</#if>
<#if swagger2>
    @ApiModel(value="${entity}对象", description="${table.comment!}")
</#if>
<#if superEntityClass??>
    public class ${entity} extends ${superEntityClass}<#if activeRecord><${entity}></#if> {
<#elseif activeRecord>
    public class ${entity} extends Model<${entity}> {
<#else>
    public class ${entity} implements Serializable {
</#if>

<#if entitySerialVersionUID>
    private static final long serialVersionUID = 1L;
</#if>
<#-- ----------  BEGIN 字段循环遍历  ---------->
<#list table.fields as field>
    <#if field.keyFlag>
        <#assign keyPropertyName="${field.propertyName}"/>
    </#if>

    <#if field.comment!?length gt 0>
        <#if swagger2>
            @ApiModelProperty(value = "${field.comment}")
        <#else>
            /**
            * ${field.comment}
            */
        </#if>
    </#if>
    <#if field.keyFlag>
    <#-- 主键 -->
        <#if field.keyIdentityFlag>
            @TableId(value = "${field.annotationColumnName}", type = IdType.AUTO)
        <#elseif idType??>
            @TableId(value = "${field.annotationColumnName}", type = IdType.${idType})
        <#elseif field.convert>
            @TableId("${field.annotationColumnName}")
        </#if>
    <#-- 普通字段 -->
    <#elseif field.fill??>
    <#-- -----   存在字段填充设置   ----->
        <#if field.convert>
            @TableField(value = "${field.annotationColumnName}", fill = FieldFill.${field.fill})
        <#else>
            @TableField(fill = FieldFill.${field.fill})
        </#if>
    <#elseif field.convert>
        @TableField("${field.annotationColumnName}")
    </#if>
<#-- 乐观锁注解 -->
    <#if (versionFieldName!"") == field.name>
        @Version
    </#if>
<#-- 逻辑删除注解 -->
    <#if (logicDeleteFieldName!"") == field.name>
        @TableLogic
    </#if>
    private ${field.propertyType} ${field.propertyName};
</#list>
<#------------  END 字段循环遍历  ---------->

<#if !entityLombokModel>
    <#list table.fields as field>
        <#if field.propertyType == "boolean">
            <#assign getprefix="is"/>
        <#else>
            <#assign getprefix="get"/>
        </#if>
        public ${field.propertyType} ${getprefix}${field.capitalName}() {
        return ${field.propertyName};
        }

        <#if chainModel>
            public ${entity} set${field.capitalName}(${field.propertyType} ${field.propertyName}) {
        <#else>
            public void set${field.capitalName}(${field.propertyType} ${field.propertyName}) {
        </#if>
        this.${field.propertyName} = ${field.propertyName};
        <#if chainModel>
            return this;
        </#if>
        }
    </#list>
</#if>

<#if entityColumnConstant>
    <#list table.fields as field>
        public static final String ${field.name?upper_case} = "${field.name}";

    </#list>
</#if>
<#if activeRecord>
    @Override
    protected Serializable pkVal() {
    <#if keyPropertyName??>
        return this.${keyPropertyName};
    <#else>
        return null;
    </#if>
    }

</#if>
<#if !entityLombokModel>
    @Override
    public String toString() {
    return "${entity}{" +
    <#list table.fields as field>
        <#if field_index==0>
            "${field.propertyName}=" + ${field.propertyName} +
        <#else>
            ", ${field.propertyName}=" + ${field.propertyName} +
        </#if>
    </#list>
    "}";
    }
</#if>
}
```

</details>
<br/>

<details>
<summary>mapper.java.ftl</summary>

```java
package ${package.Mapper};

import ${package.Entity}.${entity};
import ${superMapperClassPackage};

/**
* <p>
 * ${table.comment!} Mapper 接口
 * </p>
*
* @author ${author}
* @since ${date}
*/
<#if kotlin>
 interface ${table.mapperName} : ${superMapperClass}<${entity}>
<#else>
 public interface ${table.mapperName} extends ${superMapperClass}<${entity}> {

 }
</#if>
```

</details>
<br/>

<details>
<summary>service.java.ftl</summary>

```java
package ${package.Service};

import ${package.Entity}.${entity};
import ${superServiceClassPackage};

/**
* <p>
 * ${table.comment!} 服务类
 * </p>
*
* @author ${author}
* @since ${date}
*/
<#if kotlin>
 interface ${table.serviceName} : ${superServiceClass}<${entity}>
<#else>
 public interface ${table.serviceName} extends ${superServiceClass}<${entity}> {

 }
</#if>
```

</details>
<br/>

<details>
<summary>serviceImpl.java.ftl</summary>

```java
package ${package.ServiceImpl};

import ${package.Entity}.${entity};
import ${package.Mapper}.${table.mapperName};
import ${package.Service}.${table.serviceName};
import ${superServiceImplClassPackage};
import org.springframework.stereotype.Service;

/**
* <p>
 * ${table.comment!} 服务实现类
 * </p>
*
* @author ${author}
* @since ${date}
*/
@Service
<#if kotlin>
 open class ${table.serviceImplName} : ${superServiceImplClass}<${table.mapperName}, ${entity}>(), ${table.serviceName} {

 }
<#else>
 public class ${table.serviceImplName} extends ${superServiceImplClass}<${table.mapperName}, ${entity}> implements ${table.serviceName} {

 }
</#if>
```
</details>
<br/>