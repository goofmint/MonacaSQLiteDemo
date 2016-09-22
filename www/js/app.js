var db = null;

function addTodo(camera_url) {
    // 入力データを取得
    var title = $("#todo-title").val();
    var body = $("#todo-body").val();
    $.mobile.changePage($("#list-page"));
    
    // データ追加のSQL実行
    db.executeSql("INSERT INTO Todo (title, body) values (?, ?)", [title, body], function(res) {
      // SQL成功。表示処理に
      showTodo(title, body);
    }, function(error) {
      // SQL失敗
      alert(error.message);
    });
};

function showTodo(title, body) {
  $("#todo-list").append("<li><h3>" + title + "</h3><p>" + body + "</p></li>")
  $("#todo-list").listview('refresh');
}

document.addEventListener('deviceready', function() {
  // プラグインのテスト
  sqlitePlugin.selfTest(function() {
    // テスト成功
    // データベースを開く
    db = sqlitePlugin.openDatabase({name: 'todo.db', location: 'default'});
    // テーブル作成のSQL実行
    db.executeSql("CREATE TABLE IF NOT EXISTS Todo (id integer primary key autoincrement, title text, body text)", [], function(res) {
      // テーブル作成成功
      // データ取得のSQL実行
      db.executeSql("SELECT * FROM Todo ORDER BY id desc", [], function(rs) {
        // 取得したデータを表示
        for (var i = 0; i < rs.rows.length; i++) {
          row = rs.rows.item(i);
          showTodo(row.title, row.body);
        }
      }, function(error) {
        // データ取得失敗
        alert(error.message);
      })
    }, function(error) {
      // テーブル作成失敗
      alert(error.message);
    });
  }, function(error) {
    // プラグインテスト失敗
    alert(error.message);
  });
});