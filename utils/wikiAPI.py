# Simple interface to fetch the views using the wikipedia API and save the data in a json file
import os
import pandas as pd
import json
import pageviewapi

# Checks for the duplicate files if any and removes them
def dropDuplicates(dataframe, path):
    prefetchedFiles = os.listdir(path)
    if(len(prefetchedFiles) == 0):
        return
    prefetchedFiles = pd.DataFrame(prefetchedFiles)
    prefetchedFiles = prefetchedFiles.rename(columns={0:"Page"})
    dataframe = pd.merge(prefetchedFiles['Page'], dataframe['Page'], how = 'inner')
    print("Removing Duplicates if any. Please wait...")
    for _ in range (len(list(dataframe['Page'][dataframe['Page'].duplicated()]))):
      try:
        os.remove(os.path.join(path, list(dataframe['Page'][dataframe['Page'].duplicated()])[_]))
      except FileNotFoundError:
        continue
    print("Duplicates Removed Sucessfully.")

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
  pageTitle = pageTitle.rename(columns={0:'Page'})
  accessDetails = pd.DataFrame(accessDetails)
  accessDetails = accessDetails.rename(columns={0: 'Domain', 1: 'Access', 2: 'Viewer Type'})
  dataset = pd.concat([pageTitle, accessDetails], join='outer', axis=1)
  return dataset
    
def errorHandling(fileCount, key):
  print("error", key)
  return fileCount + 1, key + 1
  
def writeJSONFile(path, pageTitle, domain, accessDetails, viewerType, jsonResults):
  with open(path + "/" + str(pageTitle) + "_" + domain + ".org" + "_" + accessDetails + "_" + viewerType,  "w") as write_file:
    json.dump(jsonResults, write_file)


def fetchwikiData(dataset, dataframe, path, startDate, endDate, granularity):
  print("Checking for Duplicates")
  dropDuplicates(dataset, path)
  count = 0
  fileCount = 0
  prefetchedFiles = os.listdir(path)
  if len(prefetchedFiles) != 0:
    fileCount = len(prefetchedFiles) 
    prefetchedFiles = pd.DataFrame(prefetchedFiles, columns = ['Page'])
    prefetchedFiles1 = prefetchedFiles.merge(dataset['Page'])
    df = prefetchedFiles.set_index('Page').drop(prefetchedFiles1['Page']).reset_index()
    for _ in list(df['Page']):
      os.remove(os.path.join(path, str(_)))
    dataset = dataset.set_index('Page').drop(prefetchedFiles1['Page']).reset_index()
    dataframe = extractTitleAndAccessDetails(dataset)
    dataframe['Domain'] = dataframe['Domain'].str.replace('.org', '')
  print("Beginning Download.\n")
  for domain, pageTitle, accessDetails, viewerType in zip(dataframe['Domain'], dataframe['Page'], dataframe['Access'], dataframe['Viewer Type']):
    try:
      jsonResults = pageviewapi.per_article(domain, pageTitle.replace('%0%0%0', '/'), startDate, endDate, accessDetails, viewerType, granularity)
      try:
        writeJSONFile(path, pageTitle, domain, accessDetails, viewerType, jsonResults):
        fileCount = fileCount+ 1
        print("Saved", jsonResults['items'][0]['article'], fileCount)
      except OSError:
        fileCount, count = errorHandling(fileCount, count)
        continue
    except pageviewapi.client.ZeroOrDataNotLoadedException:
      try:
        with open(path + "/" + str(pageTitle) + "_" + domain + ".org" + "_" + accessDetails + "_" + viewerType,  "w") as write_file:
          json.dump('', write_file)
      except OSError:
        fileCount, count = errorHandling(fileCount, count)
        continue
      fileCount, count = errorHandling(fileCount, count)
      continue
    
  print("Download Completed.\n")
