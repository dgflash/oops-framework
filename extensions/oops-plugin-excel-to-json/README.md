### 使用说明
- npm install exceljs
- node excel2json 

### 使用规则
- Excel中前五行为工具规则数据
- 第一行为字段中文名
- 第二行为字段英文名，会生成为json数据的字段名
- 第三行为字段数据类型，只支持number、string类型，数组和对象类型可自行扩展
- 第四行标记输出服务器数据时，是否存在这个字段"server"为显示字段，"server_no"为删除字段
- 第五行标记输出客户端数据时，是否存在这个字段"client"为显示字段，"client_no"为删除字段