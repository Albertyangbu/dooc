### 树结构数据查询优化

_在刚开始出来工作不久，一家小公司，需要做自己的用户权限系统，交到我手上，当时做部门查询时遇到这么一个需求：需要根据当前部门查询出下级及下级的下级等等等所有部门。_


- 1. mysql5.6

作为一个小白，第一反应就是使用递归一级级往下查询。但是作为一个有理想的小白，也明白递归查询不是一个好的出路，但是苦于当时使用的是mysql5.6，并不像oracle一样支持递归语法，要不然就是使用自定义函数，总觉得不太好用。

苦思几天，终于想到了一个方法，使用 path+like 辅助查询，避免递归操作。

示例如下:

id | name | pid | path
---|---|---|---
01 | 集团 | -1 |  /01/
02 | 分公司1 | 01 |  /01/02/
03 | 分公司2 | 01 |  /01/03/
04 | 分公司1-部门A | 02 | /01/02/04/
05 | 分公司1-部门B | 02 | /01/02/05/
06 | 分公司1-部门A-前端小组 | 04 | /01/02/04/06/
07 | 分公司1-部门A-后端小组 | 04 | /01/02/04/06/

那么每次查询，根据当前部门path模糊查询path字段即可

```sql
-- 查询'分公司1'及下级所有部门
select id,name,pid,path from dept where path like '/01/02/%';

-- 查询'分公司1-部门A'及下级所有部门
select id,name,pid,path from dept where path like '/01/02/04/%';
```

!> **缺点:** 部门新增、更新时需要维护path字段


- 2. mysql5.8

终于，mysql也支持递归语法了，不用再维护path字段了。

```sql
-- 查询'分公司1'及下级所有部门
with recursive cte as (
select id,name,pid from dept where id = '02'
union all 
select d.id,d.name,d.pid
  from dept d 
 inner join cte cte on d.pid = cte.id
) select * from cte
```
