const fs = require('fs');
const path = require('path');
const resolve = file => path.resolve(__dirname, file);
 const fsPromises = fs.promises;

const tmpPath = resolve('./tmp/timestamps1')
/**
 * fs模块提供了一些API，用于一种类似标准POSIX函数的方式与文件系统交互
 * 
 * 所有的文件系统操作都有异步和同步两种形式
 * 异步形式的最后一个参数都是完成时的回调函数。回调第一个参数会保留给异常，如果操作成功
 * 完成，则第一个参数是null或undefined
 * 
 * 使用同步操作时，任何异常都会被立刻抛出，可以使用try/catch来处理异常，或让异常向上冒泡
 * 
 * NOTE:异步方法不能保证执行顺序，异步操作若想保证顺序，在回调中执行下一步操作
 * 在繁忙的进程中，建议使用函数的异步版本。同步的方法会阻塞整个进程，知道完成
 */

//process.cwd类似 ./
 console.log(`cmd path: ${process.cwd()}`)


// - Experimental 实验性质
 function testPromiseStyle(){
    fsPromises.access(tmpPath, fs.constants.R_OK | fs.constants.W_OK)
  .then(() => console.log('can access'))
  .catch(() => console.error('cannot access'));

 }

//  testPromiseStyle();


 function testWatch(){
     //监听文件变动，It caused by windows itself.
    fs.watch(resolve('./tmp/test.txt'), {encoding:'buffer'}, (eventType, filename)=>{
        if(filename){
            console.log(`eventType is : ${eventType}`);
        }
    });
 }

 /**
  * fs.Stats类，对象提供了一个文件的信息
  */

  function testAccess(){
      const file = 'package.json';
      //检查文件是否存在于当前目录
      fs.access(file, fs.constants.F_OK, (err) => {
          console.log(`${file} ${err?'不存在':'存在'}`);
      })

      //检查文件是否可读
      fs.access(file, fs.constants.R_OK, (err) => {
        console.log(`${file} ${err ? '不可读':'可读'}`);
      });

      //检查文件是否可写
      fs.access(file, fs.constants.W_OK, (err) => {
          console.log(`${file} ${err ? '不可写':'可写'}`);
      })

      //检查文件是否存在于当前目录，且是否可写
      fs.access(file, fs.constants.F_OK | fs.constants.W_OK, (err) => {
        if(err){
            console.error(`${file} ${err.code === 'ENOENT' ? '不存在' : '只可读'}`)
        }else{
            console.log(`${file} 存在，且可写`)
        }
      });

      try {
        fs.accessSync('etc/passwd', fs.constants.R_OK | fs.constants.W_OK);
        console.log('可读可写');
        } catch (err) {
        console.error('不可访问！');
        }
  }

  /**
   * NOTE: 不建议在fs.open,fs.readFile或fs.writeFile之前使用fs.access检查一个文件的可访问性。如果处理会造成
   * NOTE:如此处理会造成紊乱情况，因为其他进程可能在两个掉哦也能够之间改变该文件的状态。所以用户代码
   * NOTE:应该直接打开/读取/写入文件，当文件无法访问时在处理错误
   */

   function testWrite(){
       //推荐，写入数据写法
        fs.open(tmpPath, 'wx', (err, fd) => {
            if(err){
                if(err.code === 'EEXIST'){
                    console.log("文件已存在")
                    return;
                }
                throw err;
            }
            console.log("写入数据")

       });


   }

   function testRead(){
           //读取
       fs.open(tmpPath, 'r', (err, fd) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    console.error('文件不存在');
                    return;
                }
                throw err;
            }
            console.log('read')
        });
   }

   function testReadFile(){
       fs.readFile(tmpPath, (err, data) => {
            if(err) throw err;
            //如果未指定编码，data是一个buffer对象
            var str = '';
            for(var i = 0; i < data.byteLength; i++){
                str += ' '+data[i];
            }
            console.log(str)
       });
   }

   testReadFile();

 




  