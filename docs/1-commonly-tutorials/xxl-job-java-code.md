### xxl-job-java模式代码

```java
    String result = null;
    InputStream input = null;
    String uri ="";
    try {
        uri = param;//传进来的参数
        URL url = new URL(uri);
        HttpURLConnection urlcon = (HttpURLConnection) url.openConnection();
        urlcon.setRequestMethod("POST");
        urlcon.connect();// 获取连接
        input = urlcon.getInputStream();
        BufferedReader buffer = new BufferedReader(new InputStreamReader(input, "UTF-8"));
        StringBuffer bs = new StringBuffer();
        String line = null;
        while ((line = buffer.readLine()) != null) {
            bs.append(line);
        }
        result = bs.toString();
        XxlJobLogger.log("result:" + result);
    } catch (Exception e) {
        XxlJobLogger.log("[请求异常][地址：" + uri + "][错误信息：" + e.getMessage() + "]");
        return ReturnT.FAIL;
    } finally {
        try {
            if (null != input)
                input.close();
        } catch (Exception e2) {
            XxlJobLogger.log("[关闭流异常][错误信息：" + e2.getMessage() + "]");
        }
    }
    return new ReturnT<String>(ReturnT.SUCCESS_CODE, result);
    //return ReturnT.SUCCESS;
```