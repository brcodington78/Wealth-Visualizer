import {billData} from './billionaireData';
import * as d3 from 'd3'


//function returns an array of objects containing billionaire data from a single country
export const sortByCountry = (data, countryString) => {
    let sortedData = [];
    data.forEach((object) => {
        if (object.country.toLowerCase() === countryString.toLowerCase()){
            sortedData.push(object)
        }
    })
    console.log(sortedData)
    return sortedData
}

//function returns an array of billionaire objects ordered from youngest to oldest
export const sortByAge = (data, order) => {
    data.sortByAge(function(x, y){
        return d3.ascending(x.sortByAge, y.age);
    })
}



//function grabs all the industries available to it from the data provided and returns an array with string values for the industries
export const getIndustries = (data) => {
    
    let industries = []
    data.forEach(object => {
        if (!industries.includes(object.industry)) {
            industries.push(object.industry)
        }
    })
    return industries
}


//function takes in an array of objects amd returns a filtered array of objects pertaining to a country
export const filterByCountry = (data, country) => {
    let filteredArr = []
    data.forEach((obj) => {
        if(country.toLowerCase() === obj.country.toLowerCase()){
            filteredArr.push(obj)
        }
    })
    return filteredArr
} 


// takes data and sums the netWorth of individuals within the same industry. returns an obj
export const sortByIndustry = (data) => {
    let industries = getIndustries(data)
    let industriesObj = {}

    industries.forEach((industry) => {
        industriesObj[industry] = 0
    })

    data.forEach((object) => {
       let personalIndustry = object.industry;
       industriesObj[personalIndustry] += object.netWorth
    })
    

    return industriesObj
}

// takes in data in the form of an object and returns an array with individual objects containing the key value pairs
export const ObjectToArr = (dataObj) => {
    const objArr = Object.keys(dataObj).map(i => dataObj[i])
    return objArr
}
