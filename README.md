# ESH-frontend-deployment
前端自动部署程序
因为网站采用的被动式的压缩服务,云服务器采用七牛,在部署一个静态文件的时候需要删除七牛云上的静态文件缓存.这样才能起到作用。

部署程序可以通过命令行,部署一个文件或者几个文件,或者一整个文件夹。
一个文件部署通过几个步骤上传到被动压缩合并服务器,删除七牛云服务。
先简单罗列这些功能


命令初步设计 -file 