let pickFile = {
  //调用原生文件系统管理器并选取文件获取文件地址  
  //acceptType为你要查的文件类型"image/*"，"audio/*"，"video/*;image/*"  // intent.setType("image/*");//intent.setType("audio/*"); //选择音频//intent.setType("video/*;image/*"); //选择视频 （mp4 3gp 是android支持的视频格式）  
  PickFile: function(callback, acceptType) {
    let CODE_REQUEST = 1000;
    let main = plus.android.runtimeMainActivity();
    if (plus.os.name == 'Android') {
      let Intent = plus.android.importClass('android.content.Intent');
      let intent = new Intent(Intent.ACTION_GET_CONTENT);
      intent.addCategory(Intent.CATEGORY_OPENABLE);
      if (acceptType) {
        intent.setType(acceptType);
      } else {
        intent.setType("*/*");
      }
      let _this = pickFile;
      main.onActivityResult = function(requestCode, resultCode, data) {
        if (requestCode == CODE_REQUEST) {
          let uri = data.getData();
          plus.android.importClass(uri);
          let Build = plus.android.importClass('android.os.Build');
          let isKitKat = Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT;
          let contentUri
          let DocumentsContract = plus.android.importClass('android.provider.DocumentsContract');
          // DocumentProvider  
          if (isKitKat && DocumentsContract.isDocumentUri(main, uri)) {
            // console.log("版本大于 4.4 ");
            // ExternalStorageProvider  
            if ("com.android.externalstorage.documents" == uri.getAuthority()) {
              let docId = DocumentsContract.getDocumentId(uri);
              let split = docId.split(":");
              let type = split[0];

              if ("primary" == type) {
                let Environment = plus.android.importClass('android.os.Environment');
                callback(Environment.getExternalStorageDirectory() + "/" + split[1]);
              } else {
                let System = plus.android.importClass('java.lang.System');
                let sdPath = System.getenv("SECONDARY_STORAGE");
                if (sdPath) {
                  callback(sdPath + "/" + split[1]);
                }
              }
            }
            // DownloadsProvider  
            else if ("com.android.providers.downloads.documents" == uri.getAuthority()) {
              let id = DocumentsContract.getDocumentId(uri);
              let ContentUris = plus.android.importClass('android.content.ContentUris');
              contentUri = ContentUris.withAppendedId(
                //    Uri.parse("content://downloads/public_downloads"), Long.valueOf(id));  
                Uri.parse("content://downloads/public_downloads"), id);
              callback(_this.getDataColumn(main, contentUri, null, null));
            }
            // MediaProvider  
            else if ("com.android.providers.media.documents" == uri.getAuthority()) {
              let docId = DocumentsContract.getDocumentId(uri);
              let split = docId.split(":");
              let type = split[0];

              let MediaStore = plus.android.importClass('android.provider.MediaStore');
              if ("image" == type) {
                contentUri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
              } else if ("video" == type) {
                contentUri = MediaStore.Video.Media.EXTERNAL_CONTENT_URI;
              } else if ("audio" == type) {
                contentUri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;
              } else {
                contentUri = MediaStore.Files.getContentUri("external")
              }

              let selection = "_id=?";
              let selectionArgs = new Array();
              selectionArgs[0] = split[1];

              callback(_this.getDataColumn(main, contentUri, selection, selectionArgs));
            }
          }
          // MediaStore (and general)  
          else if ("content" == uri.getScheme()) {
            callback(_this.getDataColumn(main, uri, null, null));
          }
          // File  
          else if ("file" == uri.getScheme()) {
            callback(uri.getPath());
          }
        }
      }
      main.startActivityForResult(intent, CODE_REQUEST);
    }
  },

  getDataColumn: function(main, uri, selection, selectionArgs) {
    plus.android.importClass(main.getContentResolver());
    let cursor = main.getContentResolver().query(uri, ['_data'], selection, selectionArgs,
      null);
    plus.android.importClass(cursor);
    if (cursor != null && cursor.moveToFirst()) {
      let column_index = cursor.getColumnIndexOrThrow('_data');
      let result = cursor.getString(column_index)
      cursor.close();
      return result;
    }
    return null;
  }
}

export default pickFile