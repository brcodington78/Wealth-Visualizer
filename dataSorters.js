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

//returns an array with country name strings
export const getCountries = (data) => {
    let countries = []
    data.forEach(object => {
        if(!countries.includes(object.country)) {
            countries.push(object.country)
        }
    })
    return countries
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

export const netWorthByCountry = (data) => {
    let countries = getCountries(data)
    let countriesObj = {}

    countries.forEach((country) => {
        countriesObj[country] = 0
    })

    data.forEach((object) => {
        let personalCountry = object.country;

        countriesObj[personalCountry] += object.netWorth
    })

    return countriesObj
}

// takes in data in the form of an object and returns an array with individual objects containing the key value pairs
export const ObjectToArr = (dataObj) => {
    const objArr = Object.keys(dataObj).map(i => {i: dataObj[i]})
    return objArr
}

//used to convert industry objects into a better format for d3
// {'Tech': 1220000000} => {industry: 'Tech', totalWorth: 12200000}
export const newIndObj = (key, value) => {
    return ({
        industry: key,
        totalWorth: value
    })
}
export const indObjDataFormatter = (dataObj) => {
    const keys = Object.keys(dataObj) 
    const values = Object.values(dataObj)
    let newArr = []
    
    for(let i = 0; i < keys.length; i++){
        let newObj = newIndObj(keys[i], values[i])
        newArr.push(newObj)
    }
    
    return newArr
    
}


export const maxIndustryWorth = (data) => {
    let currentMax = 0
    data.forEach((obj) => {
        if(obj.totalWorth > currentMax) {
            currentMax = obj.totalWorth
        }
    })
    return currentMax
}