# Node multithreading performance test

This is a small project to measure the influence of using various "multi-threading" methods on a nodejs project.
## Installation

```bash
npm i -g artillery
npm i
```

This will generate two files:
* `/reports/benchmark.json`: Raw results
* `/reports/benchmark.json.html`: HTML report of results

## The application

The application is a simple Nodejs HTTP server with two endpoints:

 * `/short`: prints hello world
 * `/long?total=xxx`: generates a timeseries formatted as a JSON Array with random values.

 ## Tests
 
 A scenario has been written using Artillery, it can be found int [test.yaml](test.yaml). Artillery creates virtual users that call target URLs. The scenario goes like this:

 * For 10 seconds:
    * Increase virtual users with 1/sec.
    * Up to 10 concurrent users maximum.
 * For 20 seconds:
    * Increase virtual users with 5/sec.
    * Linearly scale up to 50/sec
 * For 20 seconds:
    * Increase virtual users with 50/sec.
    * Up to 250 concurrent users maximum.

While doing this, there is a 95% chance the short request is taken and a 5% chance the long request is taken. The long request generates a timeseries of length 500k.

 ### Baseline

These are the results of the test with the server running as is.

```bash
# Start the server in 1 terminal
npm start

# Run benchmark in other terminal
npm run benchmark
cp reports/benchmark.json results/baseline.json
cp reports/benchmark.json.html results/baseline.json.html
```

### Cluster approach

Using [pm2](https://pm2.keymetrics.io/) we will now start the application in cluster mode. This will effectively start `nr-of-cpus - 1` processes that all listen to the same port. In a round robin fashion, the main thread will let the child processes handle the requests. 

```bash
# global install pm2
npm i -g pm2 

# compile application
npm run build

# start processes
pm2 start dist/index.js -i "-1"
```

### Worker_thread approach

Using [workerpool](https://www.npmjs.com/package/workerpool) we will now start the application and create a worker_thread pool. This pool will only be used for executing the timeseries generation of the `/long` endpoints.

```bash
# start with workers enabled
npm start -- --workers
```

### Cluster + worker_thread approach

Combining both techniques at the same time
```bash
# start pm2 with workers enabled
pm2 start dist/index.js -i -1 -- --workers
```

## Test results

![](results/http_response.png)
![](results/user_session.png)