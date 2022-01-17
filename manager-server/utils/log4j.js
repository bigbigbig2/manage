/* 
*日志存储
*/
const log4js = require("log4js");

const levels = {
    'trace':log4js.levels.TRACE,
    'debug':log4js.levels.DEBUG,
    'info':log4js.levels.INFO,
    'warn':log4js.levels.WARN,
    'error':log4js.levels.ERROR,
    'fatal':log4js.levels.FATAL,
}

log4js.configure({
    appenders:{
        console:{
            type:'console'
        },
        info:{
            type:'file',
            filename:'logs/all-log.log'
        },
        error:{
            type:'dateFile',
            filename:'logs/log',
            pattern:'yyyy-MM-dd.log',
            alwaysIncludePattern:true //设置文件名为 filename + patterns
        }

    },
    categories:{
        default:{appenders:['console'], level:'debug'},
        error:{
            appenders:['console','error'],
            level:'error'
        },
        info:{
            appenders:['console','info'],
            level:'info'
        }
    }

})

/* 
日志输出，level为debug
@param {string} content
*/
exports.debug = (content)=>{
    let logger = log4js.getLogger();
    logger.level = levels.debug; //上面定义levels对象仅仅是为了这里避免使用字符串的形式
    logger.debug(content);
}

/*
日志输出， level 为 error
@param {string} content
*/
exports.error=(content)=>{
    let logger = log4js.getLogger('error');
    logger.level = levels.error;
    logger.error(content);
}


/*
日志输出， level 为 info
@param {string} content
*/
exports.info=(content)=>{
    let logger = log4js.getLogger('info');
    logger.level = levels.info;
    logger.info(content);
}