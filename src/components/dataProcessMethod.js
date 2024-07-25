module.exports = {
    dataProcess,
    countByCategory,
    sumByCategory,
    averageByCategory,
    varianceByCategory,
    standardDeviationByCategory,
};

function dataProcess(series, dataset, method){
    const lengthOfSeries = series.length;
    let processIndeices = [];
    let data = dataset.source;
    const ra = /Count\(([^)]*)\)/;
    const rb = /Sum\(([^)]*)\)/;
    const rc = /Var\(([^)]*)\)/;
    const rd = /Avg\(([^)]*)\)/;
    const re = /Std\(([^)]*)\)/;
    for(let i = 0; i < lengthOfSeries; i++){
        if(series[i].type === 'pie'){
            if(series[i].encode.value.match(ra)){
                series[i].encode.value = series[i].encode.value.match(ra)[1]
            }
            else if(series[i].encode.value.match(rb)){
                series[i].encode.value = series[i].encode.value.match(rb)[1]
            }
            else if(series[i].encode.value.match(rc)){
                series[i].encode.value = series[i].encode.value.match(rc)[1]
            }
            else if(series[i].encode.value.match(rd)){
                series[i].encode.value = series[i].encode.value.match(rd)[1]
            }
            else if(series[i].encode.value.match(re)){
                series[i].encode.value = series[i].encode.value.match(re)[1]
            }
            //清除之前可能引起的value改变
            if(method !== 'Default'){
                processIndeices.push(data[0].indexOf(series[i].encode.value));
                series[i].encode.value = `${method}(${series[i].encode.value})`;
            }
            //如果需要处理，改变value
        }
        else{
            if(series[i].encode.y.match(ra)){
                series[i].encode.y = series[i].encode.y.match(ra)[1]
            }
            else if(series[i].encode.y.match(rb)){
                series[i].encode.y = series[i].encode.y.match(rb)[1]
            }
            else if(series[i].encode.y.match(rc)){
                series[i].encode.y = series[i].encode.y.match(rc)[1]
            }
            else if(series[i].encode.y.match(rd)){
                series[i].encode.y = series[i].encode.y.match(rd)[1]
            }
            else if(series[i].encode.y.match(re)){
                series[i].encode.y = series[i].encode.y.match(re)[1]
            }
            if(method !== 'Default'){
                processIndeices.push(data[0].indexOf(series[i].encode.y));
                series[i].encode.y = `${method}(${series[i].encode.y})`;
                //此处同理
            }
            series[i].name = series[i].encode.y
        }
    }
    if(method === 'Default'){
        return dataset
    }
    let keyIndex = series[0].type === 'pie' ? data[0].indexOf(series[0].encode.itemName) : data[0].indexOf(series[0].encode.x);// 由于一张图只有一个x轴，所以根据series[0]来判断（也许？我是这么想的，有问题找我改）
    let processedData = data;
    if(method === 'Sum'){
        processedData = sumByCategory(data, keyIndex, processIndeices);
    }
    else if(method === 'Count'){
        processedData = countByCategory(data, keyIndex, processIndeices);
    }
    else if(method === 'Avg'){
        processedData = averageByCategory(data, keyIndex, processIndeices);
    }
    else if(method === 'Var'){
        processedData = varianceByCategory(data, keyIndex, processIndeices);
    }
    else if(method === 'Std'){
        processedData = standardDeviationByCategory(data, keyIndex, processIndeices);
    }
    console.log('处理后的数据：', processedData);
    return {source: processedData};
}

function sumByCategory(data, keyIndex, sumIndeices)
{
    const newHeaders = [data[0][keyIndex],...sumIndeices.map(index => `Sum(${data[0][index]})`)];
    const sumMap = data.slice(1).reduce((acc, row) => {
        const key = row[keyIndex];
        if(!acc.has(key)){
            acc.set(key,sumIndeices.map(() => null));
        }
        const sumArray = acc.get(key);
        sumIndeices.forEach((index, i) => {
            if(row[index] !== null){
                sumArray[i] += row[index];
            }
        });
        return acc;
    }, new Map());

    const output = [newHeaders];
    sumMap.forEach((sumArray, key) => {
        output.push([key,...sumArray]);
    });
    return output;
}

function countByCategory(data, keyIndex, countIndeices)
{
    const newHeaders = [data[0][keyIndex],...countIndeices.map(index => `Count(${data[0][index]})`)];
    const sumMap = data.slice(1).reduce((acc, row) => {
        const key = row[keyIndex];
        if(!acc.has(key)){
            acc.set(key,countIndeices.map(() => 0));
        }
        const countArray = acc.get(key);
        for(let i = 0; i < countIndeices.length; i++){ // 数数允许数成0个
            if(row[countIndeices[i]] !== null){
                countArray[i] += 1;
            }
        }
        return acc;
    }, new Map());

    const output = [newHeaders];
    sumMap.forEach((countArray, key) => {
        output.push([key,...countArray]);
    });
    return output;
}

function averageByCategory(data, keyIndex, valueIndices) {
    const newHeaders = [data[0][keyIndex], ...valueIndices.map(index => `Avg(${data[0][index]})`)];
    const countMap = new Map();

    data.slice(1).forEach(row => {
        const key = row[keyIndex];
        if (!countMap.has(key)) {
            countMap.set(key, valueIndices.map(() => ({ sum: null, count: 0 })));
        }
        const averages = countMap.get(key);
        valueIndices.forEach((index, i) => {
            if(row[index] !== null){
                averages[i].sum += row[index];
                averages[i].count += 1;
            }
        });
    });

    const output = [newHeaders];
    countMap.forEach((averages, key) => {
        const averagesRow = averages.map(avg => {
            if(avg.count === 0){
                return null;
            }
            else{
                return avg.sum / avg.count;
            }
        });
        output.push([key, ...averagesRow]);
    });
    return output;
}

function varianceByCategory(data, keyIndex, valueIndices) {
    const newHeaders = [data[0][keyIndex], ...valueIndices.map(index => `Var(${data[0][index]})`)];
    const statsMap = new Map();

    data.slice(1).forEach(row => {
        const key = row[keyIndex];
        if (!statsMap.has(key)) {
            statsMap.set(key, valueIndices.map(() => ({ sum: null, sumSq: null, count: 0 })));
        }
        const stats = statsMap.get(key);
        valueIndices.forEach((index, i) => {
            if(row[index] !== null){
                stats[i].sum += row[index];
                stats[i].sumSq += row[index] * row[index];
                stats[i].count += 1;
            }
        });
    });

    const output = [newHeaders];
    statsMap.forEach((stats, key) => {
        const varianceRow = stats.map(stat => {
            if(stat.count === 0){
                return null;
            }
            else{
                const mean = stat.sum / stat.count;
                return (stat.sumSq - mean * stat.sum) / stat.count;
            }
        });
        output.push([key, ...varianceRow]);
    });
    return output;
}

function standardDeviationByCategory(data, keyIndex, valueIndices) {
    const newHeaders = [data[0][keyIndex], ...valueIndices.map(index => `Std(${data[0][index]})`)];
    const statsMap = new Map();

    data.slice(1).forEach(row => {
        const key = row[keyIndex];
        if (!statsMap.has(key)) {
            statsMap.set(key, valueIndices.map(() => ({ sum: null, sumSq: null, count: 0 })));
        }
        const stats = statsMap.get(key);
        valueIndices.forEach((index, i) => {
            if(row[index] !== null){
                stats[i].sum += row[index];
                stats[i].sumSq += row[index] * row[index];
                stats[i].count += 1;
            }
        });
    });

    const output = [newHeaders];
    statsMap.forEach((stats, key) => {
        const stddevRow = stats.map(stat => {
            if(stat.count === 0){
                return null;
            }
            else{
                const mean = stat.sum / stat.count;
                return Math.sqrt((stat.sumSq - mean * stat.sum) / stat.count);
            }
        });
        output.push([key, ...stddevRow]);
    });
    return output;
}
