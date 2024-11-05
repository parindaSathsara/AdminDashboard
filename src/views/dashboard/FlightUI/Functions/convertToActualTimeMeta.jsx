const convertToActualTimeMeta = (passingDate) => {

    var time = passingDate?.substring(0, 5)
    // var offset=passingDate?.substring(8,11)

    // var timeToDate=Date.parse("1970-01-01 "+time)


    // const finalDate=new Date(timeToDate)
    // finalDate.setUTCHours(5)
    // // var timeToDate=new Date();
    // // 

    // // var date= new Date(passingDate)

    //console.log(finalDate.toTimeString())

    return time;
}

export default convertToActualTimeMeta;