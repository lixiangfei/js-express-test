//生成长度为10，0填充的Buff
const buf1 = Buffer.alloc(10);
//生成长度为10，1填充的buff
const buf2 = Buffer.alloc(10, 1);

//{ type: 'Buffer', data: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] }
console.log(buf1.toJSON());
// empty
console.log(`toString is : ${buf1.toString()}`);

//生成长度为10，为初始化的buff,速度快，缺点：可能包含旧数据，需要fill or write覆盖数据
const buf3 = Buffer.allocUnsafe(10);
// [object Object]
console.log(`buf3 json: ${buf3.toJSON()}`)

//创建一个包含[1,2,3]的buffer
//{type:'Biffer'. data:[1,1,3]} 超过255, val/256 -1, 如果是负数 256+(val%256)
//会保证值在0-255之间
const buff4 = Buffer.from([1,-513,3]);
console.log(buff4.toJSON());

//传入字符串，buffer是字符串的副本，改变不会有影响
var test = 'test';
const buff5 = Buffer.from(test);
console.log(buff5.toString()); //test
test = 'test1';
console.log(buff5.toString()); //test

/**
 * Buffer.from(), Buffer.alloc(),Buffer.allocUnsafe()
 *  Node.js v6之前的版本，Buffer实例是通过Buffer构造哈那树创建，它根据提供的参数返回不同的Buffer
 *      1.传一个值作为第一个参数给buffer (new Buffer(10)),则分配一个指定大小的新建buffer对象。在Node.js 8之前，
 *        分配给这种Buffer实例的内存是没有初始化的，且可能包含敏感数据。这种Buffer实例随后必须被初始化，可以用buf.fill(0)或
 *      写满这个Buffer. node.js v8之后，Buffer(num) new Buffer(num)将返回一个初始化内存之后的Buffer 最新版本，这中初始化默认过时了 
 *      2.传一个字符串，数组或Buffer作为第一个参数，将所传对象的数据拷贝到Buffer之中
 *      3.传入ArrayBuffer或SharedArrayBuffer，则返回一个与传入的ArrayBuffer共享所分配内存的Buffer
 * 
 *      因为new Buffer的行为会根据所传入的第一个参数的值的数据类名改变，所以如果程序没有正确校验参数，会引入安全问题
 * 
 *  为了使Buffer实例的创建更可靠，更不容易出错，各种new Buffer()构造函数已废弃，并有Buffer.from,Buffer.alloc()和
 * Buffer.allocUnsafe方法替代
 * 
 *   Buffer.from(array)返回一个新建的包含所提供的字节数据的副本的buffer
 *   Buffer.from(arrayBuffer,[,byteOffset [,length]] ) 返回一个新建的与给定ArrayBuffer共享同一内存的Buffer
 *   Buffer.from(buffer) 返回一个新建的包含所提供的Buffer的内容的副本的Buffer
 *   Buffer.from(string,[, encoding]) 返回一个新建的包含所提供的字符串的副本的Buffer
 */


 /**
  * 
    Buffer与字符编码
        Buffer实例一般用于表示编码字符的序列，utf8,Base64或16进制。通过使用显示的字符编码，就可以在
        Buffer实例与普通的JS字符串之间进行相互转换
  */
 //buff存在，可以很方便对字符串进行转64编码
  var buf = Buffer.from('hello world✓ à', 'utf8');

  console.log(buf.toString('hex'));

  console.log(buf.toString('base64'))

  //window下转base64,与buf转出来不同   选择utf8则相同
  function base64t(){
    var str = 'hello world à';
    window.btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1){
      return String.fromCharCode('0x'+p1);
    }));
  }

  var bufT = Buffer.from('aGVsbG8gd29ybGTinJMgw6A=','base64')
  console.log(bufT.toString('utf8'))
  //---------------------------------------------------------------

  function testArrayBuf(){
      var arrayBuf = new ArrayBuffer(10);
    var int8Arr = new Uint8Array(arrayBuf);
    var val;
    for(var i = 0; i < arrayBuf.byteLength; i++){
      val = Math.floor(Math.random()*255)
      int8Arr[i] = val;
    }
  }

//-------------直接修改arrayBuf内容，int8Arr内容不会变

  //或者写成 int8Arr = new Uint8Array(10);  int8Arr.buffer--->ArrayBuffer

  //Buffer 与 TypedArray
  /**
   * Buffer 实例也是Uint8Array实例。但是有些不同
   * 当ArrayBuffer#slice创建一个切片的副本时，Buffer#slice的实现是在现有的buffer上不经过宝贝直接创建
   */