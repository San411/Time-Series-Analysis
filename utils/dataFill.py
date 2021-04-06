#fills the missing values in the dataframe by individually requesting the data for that time interval

import pandas as pd
import pageviewapi

def extractTitleAndAccessDetails(dataset):
  pageTitle = list(dataset["Page"])
  for i in range(len(pageTitle)):
    pageTitle[i] = pageTitle[i].split("_")
  accessDetails = []
  for _ in range(len(pageTitle)):
    accessDetails.append(pageTitle[_][-3:])
    pageTitle[_] = pageTitle[_][:-3]
    pageTitle[_] = "_".join(pageTitle[_])
  pageTitle = pd.DataFrame(pageTitle)
  pageTitle = pageTitle.rename(columns={0:'Page Title'})
  accessDetails = pd.DataFrame(accessDetails)
  accessDetails = accessDetails.rename(columns={0: 'Domain', 1: 'Access', 2: 'Viewer Type'})
  return pageTitle, accessDetails

def fillMissingValues(dataframe):
  pageTitle, accessDetails = extractTitleAndAccessDetails(dataframe)
  dataIndex = pd.concat([pageTitle, accessDetails], join='outer', axis=1)
  beforeFilling = dataframe.isnull().sum()
  dates = list(dataframe.columns)
  dates = dates[1:]
  for date in dates:
    nullValues = dataframe[date].isnull().to_numpy().nonzero()
    for index in nullValues[0]:
      try:
        dataframe.at[dataIndex['Page Title'][index], date] = pageviewapi.per_article(dataIndex['Domain'][index], dataIndex['Page Title'][index], date.replace('-',''),date.replace('-'         ,''),               dataIndex['Access'][index], dataIndex['Viewer Type'][index], granularity = 'daily')['items'][0]['views']
        print("Filled", dataIndex['Page Title'][index], date)
      except pageviewapi.client.ZeroOrDataNotLoadedException:
        print("No data available.")
        continue
  afterFilling = dataframe.isnull().sum()
  print('Before filling the missing values: ', beforeFilling)
  print('After filling the missing values: ', afterFilling)
  return dataframe
