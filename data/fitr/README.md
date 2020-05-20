If we add new masjids (and we should!) to regenerate the `zipcode\_to\_masjid.json` file all you gotta do is follow these 4 simple steps:

1. Download our updated masjid_db.tsv from the google spreadsheet. Make sure you export as TSV not CSV.
2. Download zipcodes_distances_filepath from https://data.nber.org/data/zip-code-distance-database.html (you should look at the infinite dataset).
3. Configure the filepaths in `zipcodes.py`
4. Run `python zipcodes.py`
