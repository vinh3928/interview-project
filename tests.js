'use strict';
var request = require('request');

var baseurl = 'http://127.0.0.1:8081/';
var errCount = 0;
var datCount = 0;
var dat = [
        {"id":"1","lastname":"Smith","firstname":"Frank","address1":"123 Main Street","city":"Nashville","state":"Tennessee","zip":"34321"},
        {"id":"2","lastname":"Johnson","firstname":"Todd","address1":"456 Purvue Ave","city":"Springfield","state":"Tennessee","zip":"36433"},
        {"id":"3","lastname":"McCall","firstname":"Susan","address1":"1254 Dalton St","city":"Manchester","state":"Alabama","zip":"65732"}
    ];

beginTest();

function beginTest() {

    console.log(" Clearing data..");

    request.post({
        url: baseurl + 'clearAddress',
        headers: {"Content-type":"application/json"},
        json: {}
    }, 
    (error, res, body) => {

        if (res.statusCode != 200) {
            console.log(error)
            console.log(" Data NOT cleared");
            console.log("FAILED");
        }

        if (error) {
            console.log(error)
            console.log(" Data NOT cleared");
            console.log("FAILED");
        }
        else
        {
            console.log(" Data cleared");
            console.log("=====POST TEST:");
            test_postTest(dat[datCount]);
        }
    });

}


function test_postTest(record)
{
    // Test 1 - post new record
    request.post({
        url: baseurl + 'storeAddress',
        headers: {"Content-type":"application/json"},
        json: record
    }, 
    (error, res, body) => {

        if (error) {
            console.log(error)
            console.log("FAILED");
            return
        }
        
        let errs = body.errors;
        
        if(errs.length == 0)
        {
            console.log("1 record posted.");

            if(datCount == 2)
            {
                console.log("PASSED");
                test_getAll();
            }
            else
            {
                datCount++;
                test_postTest(dat[datCount]);
            }
            
        }
        else
        {
            console.log(errs.length + " errors.");
            for(var x=0;x<errs.length;x++)
                console.log(" " + JSON.stringify(errs[x]));
            console.log("FAILED");
        }
    })
}

function test_getAll()
{
    // Test 2 - Get All Records
    request.get({
        url: baseurl+'getAddressList',
        json: true,
        headers: {'User-Agent': 'request'}
    }, (err, res, data) => {

        console.log("=====GET ALL TEST:");

        if (err) {
        console.log('Error:', err);
        } else if (res.statusCode !== 200) {
        console.log('Status:', res.statusCode);
        } else {
            console.log("Records found: " + data.length)
            
            errCount = 0;

            for(let x=0;x<data.length;x++)
            {
                let rec = data[x];

                checkProperty(x, rec, "id");
                checkProperty(x, rec, "firstname");
                checkProperty(x, rec, "lastname");
                checkProperty(x, rec, "address1");
                checkProperty(x, rec, "city");
                checkProperty(x, rec, "state");
                checkProperty(x, rec, "zip");
                    

                for(let y=0;y<data.length;y++)
                {
                    if(x != y)
                    {
                        if(rec.id == data[y].id)
                        {
                            console.log("duplicate record found");
                            errCount++;
                        }
                    }
                }
            }

            if (errCount == 0)
            {
                console.log("PASSED");
                test_getSingle();
            }
            else
            {
                console.log(errCount + " error(s) found.");
                console.log("FAILED");
            }
                
        }
    });
}

function test_getSingle()
{
    // Test 3 - Get Single Record
    request.get({
        url: baseurl+'getAddress/1',
        json: true,
        headers: {'User-Agent': 'request'}
      }, (err, res, data) => {
    
        console.log("=====GET SINGLE TEST:");
    
        if (err) {
          console.log('Error:', err);
        } else if (res.statusCode !== 200) {
          console.log('Status:', res.statusCode);
        } else {

            if(data != null)
            {
                console.log("Records found: 1");
            
                errCount = 0;
                errCount += (data.id == "1" ? 0 : 1);
                errCount += (data.lastname == "Smith" ? 0 : 1);
                errCount += (data.firstname == "Frank" ? 0 : 1);
                errCount += (data.address1 == "123 Main Street" ? 0 : 1);
                errCount += (data.city == "Nashville" ? 0 : 1);
                errCount += (data.state == "Tennessee" ? 0 : 1);
                errCount += (data.zip == "34321" ? 0 : 1);
            }
            else
            {
                console.log("Records found: 0");
                errCount = 1;
            }
                
    
            if (errCount == 0)
            {
                console.log("PASSED");
                test_duplicatePostTest();
            }
            else
            {
                console.log(errCount + " error(s) found.");
                console.log("FAILED");
            }
                
        }
    });
}


function test_duplicatePostTest()
{
    // Test 3 - post duplicate id record
    request.post({
        url: baseurl + 'storeAddress',
        headers: {"Content-type":"application/json"},
        json: 
        {
            "id":"1","lastname":"Smith","firstname":"Frank","address1":"123 Main Street","city":"Nashville","state":"Tennessee","zip":"34321"
        }
    }, 
    (error, res, body) => {
        
        console.log("=====DUPLICATE POST TEST:");
        
        if (error) {
            console.error(error)
            return
        }
        
        let errs = body.errors;
        
        if(errs.length == 0)
        {
            console.log("no errors.");
            console.log("FAILED");
        } 
        else
        {
            console.log(errs.length + " errors.");
            for(var x=0;x<errs.length;x++)
                console.log(" " + JSON.stringify(errs[x]));
            console.log("PASSED");

            test_dataTypeTest();
        }
    })
}

function test_dataTypeTest()
{
    // Test 4 - post record with invalid zip code
    request.post({
        url: baseurl + 'storeAddress',
        headers: {"Content-type":"application/json"},
        json: 
        {
            "id":"766","lastname":"Smith","firstname":"Frank","address1":"123 Main Street","city":"Nashville","state":"Tennessee","zip":"abcd"
        }
    }, 
    (error, res, body) => {
        
        console.log("=====INVALID DATATYPE POST TEST:");
        
        if (error) {
            console.log(error);
            console.log("FAILED");
            return
        }
        
        let errs = body.errors;
        
        if(errs.length == 0)
        {
            console.log("no errors.");
            console.log("FAILED");
        } 
        else
        {
            console.log(errs.length + " errors.");
            for(var x=0;x<errs.length;x++)
                console.log(" " + JSON.stringify(errs[x]));
            console.log("PASSED");

            test_missingPostTest();
        }
    })
}

function test_missingPostTest()
{
    // Test 5 - post with missing lastname field
    request.post({
        url: baseurl + 'storeAddress',
        headers: {"Content-type":"application/json"},
        json: 
        {
            "id":"1001","firstname":"Frank","address1":"123 Main Street","city":"Nashville","state":"Tennessee","zip":"34321"
        }
    }, 
    (error, res, body) => {
        
        console.log("=====MISSING DATA POST TEST:");
        
        if (error) {
            console.error(error)
            return
        }
        
        let errs = body.errors;
        
        if(errs.length == 0)
        {
            console.log("no errors.");
            console.log("FAILED");
        } 
        else
        {
            console.log(errs.length + " errors.");
            for(var x=0;x<errs.length;x++)
                console.log(" " + JSON.stringify(errs[x]));
            console.log("PASSED");
        }
    })
}

function checkProperty(x, rec, prop)
{
    if(!rec.hasOwnProperty(prop))
    {
        console.log("record " + x + " missing property '" + prop + "'")
        errCount++;
    }
}