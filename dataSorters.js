import {billData} from './billionaireData';

const sortByCountry = (data, countryString) => {
    let sortedData = [];
    data.forEach((object) => {
        if (object.country.toLowerCase() === countryString.toLowerCase()){
            sortedData.push(object)
        }
    })
    console.log(sortedData)
    return sortedData
}

sortByCountry(billData, 'china')


// let sampleData = [
//     {
//         "id": 1,
//         "name": "Jeff Bezos",
//         "country": "United States",
//         "netWorth": 177,
//         "age": 57,
//         "source": "Amazon",
//         "industry": "Technology"
//     },
//     {
//         "id": 2,
//         "name": "Elon Musk",
//         "country": "United States",
//         "netWorth": 151,
//         "age": 49,
//         "source": "Tesla, SpaceX",
//         "industry": "Automotive"
//     },
//     {
//         "id": 3,
//         "name": "Bernard Arnault & family",
//         "country": "France",
//         "netWorth": 150,
//         "age": 72,
//         "source": "LVMH",
//         "industry": "Fashion & Retail"
//     },
//     {
//         "id": 4,
//         "name": "Bill Gates",
//         "country": "United States",
//         "netWorth": 124,
//         "age": 65,
//         "source": "Microsoft",
//         "industry": "Technology"
//     },
//     {
//         "id": 5,
//         "name": "Mark Zuckerberg",
//         "country": "United States",
//         "netWorth": 97,
//         "age": 36,
//         "source": "Facebook",
//         "industry": "Technology"
//     },
//     {
//         "id": 6,
//         "name": "Warren Buffett",
//         "country": "United States",
//         "netWorth": 96,
//         "age": 90,
//         "source": "Berkshire Hathaway",
//         "industry": "Finance & Investments"
//     },
//     {
//         "id": 7,
//         "name": "Larry Ellison",
//         "country": "United States",
//         "netWorth": 93,
//         "age": 76,
//         "source": "software",
//         "industry": "Technology"
//     },
//     {
//         "id": 8,
//         "name": "Larry Page",
//         "country": "United States",
//         "netWorth": 91.5,
//         "age": 48,
//         "source": "Google",
//         "industry": "Technology"
//     },
//     {
//         "id": 9,
//         "name": "Sergey Brin",
//         "country": "United States",
//         "netWorth": 89,
//         "age": 47,
//         "source": "Google",
//         "industry": "Technology"
//     },
//     {
//         "id": 10,
//         "name": "Mukesh Ambani",
//         "country": "India",
//         "netWorth": 84.5,
//         "age": 63,
//         "source": "diversified",
//         "industry": "Diversified"
//     },
//     {
//         "id": 11,
//         "name": "Amancio Ortega",
//         "country": "Spain",
//         "netWorth": 77,
//         "age": 85,
//         "source": "Zara",
//         "industry": "Fashion & Retail"
//     },
//     {
//         "id": 12,
//         "name": "Francoise Bettencourt Meyers & family",
//         "country": "France",
//         "netWorth": 73.6,
//         "age": 67,
//         "source": "L'Oréal",
//         "industry": "Fashion & Retail"
//     },
//     {
//         "id": 13,
//         "name": "Zhong Shanshan",
//         "country": "China",
//         "netWorth": 68.9,
//         "age": 66,
//         "source": "beverages, pharmaceuticals",
//         "industry": "Food & Beverage"
//     },
//     {
//         "id": 14,
//         "name": "Steve Ballmer",
//         "country": "United States",
//         "netWorth": 68.7,
//         "age": 65,
//         "source": "Microsoft",
//         "industry": "Technology"
//     },
//     {
//         "id": 15,
//         "name": "Ma Huateng",
//         "country": "China",
//         "netWorth": 65.8,
//         "age": 49,
//         "source": "internet media",
//         "industry": "Technology"
//     },
//     {
//         "id": 16,
//         "name": "Carlos Slim Helu & family",
//         "country": "Mexico",
//         "netWorth": 62.8,
//         "age": 81,
//         "source": "telecom",
//         "industry": "Telecom"
//     },
//     {
//         "id": 17,
//         "name": "Alice Walton",
//         "country": "United States",
//         "netWorth": 61.8,
//         "age": 71,
//         "source": "Walmart",
//         "industry": "Fashion & Retail"
//     },
//     {
//         "id": 18,
//         "name": "Jim Walton",
//         "country": "United States",
//         "netWorth": 60.2,
//         "age": 72,
//         "source": "Walmart",
//         "industry": "Fashion & Retail"
//     },
//     {
//         "id": 19,
//         "name": "Rob Walton",
//         "country": "United States",
//         "netWorth": 59.5,
//         "age": 76,
//         "source": "Walmart",
//         "industry": "Fashion & Retail"
//     },
//     {
//         "id": 20,
//         "name": "Michael Bloomberg",
//         "country": "United States",
//         "netWorth": 59,
//         "age": 79,
//         "source": "Bloomberg LP",
//         "industry": "Media & Entertainment"
//     },
//     {
//         "id": 21,
//         "name": "Colin Zheng Huang",
//         "country": "China",
//         "netWorth": 55.3,
//         "age": 41,
//         "source": "e-commerce",
//         "industry": "Technology"
//     } ]

