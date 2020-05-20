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
def closest_masjids_to_zipcode(masjid_zipcodes_filepath, zipcodes_distances_filepath, output_filepath, num_masjids):
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

  with open(output_filepath, 'w') as f:
    json.dump(closest_masjids, f)

  return


closest_masjids_to_zipcode('masjid_zip_codes.csv', '/Users/itinawi/Downloads/100miles.csv', 'out.json', 3)
