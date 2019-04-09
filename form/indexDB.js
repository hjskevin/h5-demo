
(function() {
  //获取元素
  var Oform = document.querySelector("#form");
  var Otbody = document.querySelector("#result tbody");
  var Ostats = document.getElementById("status");
  //模板字符内容
  var strTpList = document.getElementById("tplist").innerHTML;

  var logError = function(error) {
      Ostats.style.display = "block";
      Ostats.innerHTML = "<span class='error'>" + error + "</span>";
    },
    logInfo = function(info) {
      Ostats.style.display = "block";
      Ostats.innerHTML = "<span class='info'>" + info + "</span>";
    };

  //简易模板方法
  String.prototype.temp = function(obj) {
    return this.replace(/\$\w+\$/gi, function(matchs) {
      return obj[matchs.replace(/\$/g, "")] || "";
    });
  };

  //数据库名称
  var dbName = "demo";

  //数据库版本
  var version = 1;

  //数据库结果
  var db;

  //打开数据库
  var DBOpenRequest = window.indexedDB.open(dbName, version);

  //数据库打开失败
  DBOpenRequest.onerror = function(event) {
    logError('数据库代开失败');
  }

  DBOpenRequest.onsuccess = function(event) {
    //存储数据结果
    db = DBOpenRequest.result;

    //显示数据
    method.show();
  };

  //下面事情执行于：数据库首次创建版本。或者window.indexedDB.open传递的新版本
  DBOpenRequest.onupgradeneeded = function(event) {
    var db = event.target.result;

    db.onerror = function(event) {
      logError('数据库代开失败');
    }

    //创建一个数据库存储对象
    var objectStore = db.createObjectStore(dbName, {
      keyPath: 'id',
      autoIncrement: true
    });

    //定义存储对象的数据项
    objectStore.createIndex('id', 'id', { unique: true });
    objectStore.createIndex('name', 'name');
    objectStore.createIndex('begin', 'begin');
    objectStore.createIndex('end', 'end');
    objectStore.createIndex('person', 'person');
    objectStore.createIndex('remark', 'remark');
  };

  var method = {
    add: function(newItem) {
      var transaction = db.transaction([dbName], "readwrite");

      //打开已经存储的数据对象
      var objectStore = transaction.objectStore(dbName);
      //添加到数据库对象中
      var objectStoreRequest = objectStore.add(newItem);
      objectStoreRequest.onsuccess = function(event) {
        method.show();
      };

    },
    edit: function(id, data) {
      var transaction = db.transaction([dbName], "readwrite");
      var objectStore = transaction.objectStore(dbName);
      //获取存储的对应键的存储对象
      var objectStoreRequest = objectStore.get(id);
      //获取成功后替换当前数据
      objectStoreRequest.onsuccess = function(event) {
        //当前数据
        var myRecord = objectStoreRequest.result;
        //遍历替换
        for (var key in data) {
          if (typeof myRecord[key] != 'undefined') {
            myRecord[key] = data[key];
          }
        }
        objectStore.put(myRecord);
      };
    },
    del: function(id) {
      var objectStore = db.transaction([dbName], "readwrite").objectStore(dbName);
      var objectStoreRequest = objectStore.delete(id);
      objectStoreRequest.onsuccess = function() {
        method.show();
      };
    },
    show: function() {
      var htmlProjectList = "";
      var objectStore = db.transaction(dbName).objectStore(dbName);
      objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
          htmlProjectList = htmlProjectList + strTpList.temp(cursor.value);
          cursor.continue();
        } else {
          logInfo("");
          Otbody.innerHTML = htmlProjectList;
          if (htmlProjectList == "") {
            logInfo("暂无数据");
          }
        }
      }
    }
  };

  //表单提交新增数据
  Oform.addEventListener('submit', function(event) {
    event.preventDefault();
    var formData = {};
    [].slice.call(this.querySelectorAll('input,textarea')).forEach(function(ele) {
      if (ele.name) {
        formData[ele.name] = ele.value;
      }
    });
    method.add(formData);
    this.reset();
  });

  //编辑事件
  Otbody.addEventListener('focusout', function(event) {
    var eleTd = event.target;
    var id = eleTd && eleTd.getAttribute('data-id');
    if (!id || !/td/.test(eleTd.tagName)) { return; }

    var data = {
      id: id * 1
    };

    [].slice.call(eleTd.parentElement.querySelectorAll('td[data-key]')).forEach(function(td) {
      var key = td.getAttribute("data-key");
      var value = td.innerText || td.textContent || '';
      data[key] = value;
    });
    method.edit(id, data);
  });

  //删除事件
  Otbody.addEventListener('click', function(event) {
    var eleBtn = event.target,
      id = "";
    if (eleBtn && eleBtn.classList.contains('jsListDel') && (id = eleBtn.getAttribute("data-id"))) {
      method.del(id * 1);
      event.preventDefault();
    }
  });
})();