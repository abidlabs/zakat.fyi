import csv
import json

def get_masjid_zipcodes_from_address(address_file):
  zipcodes = set()
  with open(address_file) as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',')
    for row in spamreader:
      zipcodes.add(row[-1].split(" ")[-1].strip())

  return zipcodes


# NOTE: download zipcodes_distances_filepath from https://data.nber.org/data/zip-code-distance-database.html
def closest_masjids_to_zipcode(masjid_zipcodes_filepath, zipcodes_distances_filepath, masjid_db_filepath, output_filepath, num_masjids):
  """Takes in a .csv file of all masjid zip codes. Writes a .json for each zip code, mapped to the
      `num_closest` number of masjids."""
  closest_masjids = {}
  masjid_zipcodes = get_masjid_zipcodes_from_address(masjid_zipcodes_filepath)

  zip1_masjid_distance = {}

  with open(zipcodes_distances_filepath) as csvfile:
    reader = csv.reader(csvfile, delimiter=',')
    for row in reader:
      zip1 = row[0]
      masjid_zip = row[1]
      distance = row[2]
      if masjid_zip in masjid_zipcodes:
        if zip1 not in zip1_masjid_distance:
          zip1_masjid_distance[zip1] = []

        # add zip, distance for that masjid
        zip1_masjid_distance[zip1].append([masjid_zip, distance])
        
  # sort the closest masjids
  #  & return the closest `num_masjids` mosques zipcodes
  for zip1 in zip1_masjid_distance:
    closest_zips = sorted(zip1_masjid_distance[zip1], key=lambda x: x[1])[:num_masjids]

    closest_masjids[zip1] = closest_zips

  # NOTE: will return to you the list of `num_masjid` closest zips, such that each zip contains at least 1 zip.
  #  It may be that the `num_masjids` closest masjids are in the first zip

  zip_to_masjid = {}
  # get all masjid information
  with open(masjid_db_filepath) as csvfile:
    reader = csv.reader(csvfile, delimiter='\t')
    next(reader)
    for row in reader:
      # State Masjid Name Address Zip Code  Image?  Link  Zakat-ul-Fitr Email
      state, name, address, zip_code, image, link, fitr, email = row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7]
      if zip_code not in zip_to_masjid:
        zip_to_masjid[zip_code] = []
      masjid = {"name": name, "address": address, "state": state, "fitr": fitr, "email": email, "link": link}
      zip_to_masjid[zip_code].append(masjid)


  final_masjids = {}
  for zip1 in closest_masjids:
    final_masjids[zip1] = []
    for zip2 in closest_masjids[zip1]:
      print(len(closest_masjids))
      print(zip2[0])
      for masjid in closest_masjids[zip2[0]]:
        if len(final_masjids[zip1]) < num_masjids:
          masjid_info = masjid
          masjid_info["distance"] = zip2[1]
          final_masjids[zip1].append(zip_to_masjid[zip2[0]][masjid])
  

  with open(output_filepath, 'w') as f:
    json.dump(final_masjids, f, indent=4)

  return


# NOTE: download zipcodes_distances_filepath from https://data.nber.org/data/zip-code-distance-database.html
# closest_masjids_to_zipcode(masjid_zipcodes_filepath, zipcodes_distances_filepath, output_filepath, num_masjids):
closest_masjids_to_zipcode('masjid_zip_codes.csv', '/Users/itinawi/Downloads/100miles.csv', 'masjid_db.tsv', 'zipcodes.json', 3)
