// reset form values from json object
export function restoreForm(data, cb) {
  var keys = Object.keys(data);

  // handle financials-table ids
  var financialTableInfo = []
  for (var i = 0; i < keys.length; i++) {
    var id = keys[i];
    var val = data[id];
    var split_id = id.split("-")[0];
    if (["stockname", "totalassets", "totalshares", "yourshares"].includes(split_id)) {
      // this is a financial row
      var row_num = id.split("-")[1];
      financialTableInfo.push([row_num, split_id, val]);
    }
  }
  repopulateFinancialTable(financialTableInfo);

  // restore all other ids
  for (var i = 0; i < keys.length; i++) {
    var id = keys[i];
    var val = data[id];
    var $el = $('[id="'+id+'"]'),
        type = $el.attr('type');

    switch(type){
      case 'checkbox':
          $el.prop('checked', true);
          break;
      case 'radio':
          $el.prop('checked', true);
          var $el_block = $('[class="' + id.replace("yes", "related") + '"]'); 
          $el_block.css('display', 'block');
          break;
      default:
          $el.val(val);
    }

    if (i === keys.length - 1 && cb) {
      return cb();
    }
  }
}

// helper method for restoreForm method
function repopulateFinancialTable(financialTableInfo) {
  // clear table first 
  $("#financials-table tbody").empty();

  // create the rows from the table information
  var financialTableRows = {};
  var row_nums = [];
  for (var i = 0; i < financialTableInfo.length; i++) {
    var row_num = financialTableInfo[i][0];
    var id = financialTableInfo[i][1];
    var val = financialTableInfo[i][2];
    if (row_nums.indexOf(row_num) == -1) {
      row_nums.push(row_num);
    }

    if (row_num in financialTableRows) {
      financialTableRows[row_num].push({id: val});
    } else {
      financialTableRows[row_num] = [{id, val}];
    }
  }

  for (var i = 0; i < row_nums.length; i++) {
    var row_num = row_nums[i];
    // TODO(ihssan): investigate if storing these numbers is needed at all
    //                or if getting the id is enough for caching.
    var ts = financialTableRows[row_num]['totalshares'];
    var ys = financialTableRows[row_num]['yourshares'];
    var sn = financialTableRows[row_num]['stockname'];
    var ta = financialTableRows[row_num]['totalassets'];

    var row = "\"<tr id=\'"+ i +"\'><td><input type=\"text\" class=\"form-control stock-name\" id=\'stockname-"+ i +"\' placeholder=\"Stock Name\" style=\"width=5px;\"></td><td><div class=\"form-group money-text-field required\"><div class=\"input-group mb-3\"><input type=\"text\" class=\"form-control stock-assets\" id=\'totalassets-"+ i +"\' placeholder=\"0\" style=\"width=10%;\"></div></div></td><td><div class=\"form-group money-text-field required\"><div class=\"input-group mb-3\"><input type=\"text\" class=\"form-control stock-total-shares\" id=\'totalshares-"+ i +"\' placeholder=\"0\" style=\"width=10%;\"></div></div></td><td><div class=\"form-group money-text-field required\"><div class=\"input-group mb-3\"><input type=\"text\" class=\"form-control stock-your-shares\" placeholder=\"0\" id=\'yourshares-"+ i +"\' style=\"width=10%;\"></div></div></td>\"<td><input type=\"button\" style=\"color:white; background-color:#DC143C; border-radius:2px;\" value=\"Delete\" onclick=\"deleteFinancialRow()\"></td></tr>"

    $("#financials-table").append(row);
  }
}

/**
 * Checks that an element has a non-empty `name` and `value` property.
 * @param  {Element} element  the element to check
 * @return {Bool}             true if the element is an input, false if not
 */
const isValidElement = element => {
  return element.id && element.value;
};

/**
* Checks if an element’s value can be saved (e.g. not an unselected checkbox).
* @param  {Element} element  the element to check
* @return {Boolean}          true if the value should be added, false if not
*/
const isValidValue = element => {
  return !['checkbox', 'radio'].includes(element.type) || element.checked;
};

/**
* Checks if an input is a checkbox, because checkboxes allow multiple values.
* @param  {Element} element  the element to check
* @return {Boolean}          true if the element is a checkbox, false if not
*/
const isCheckbox = element => element.type === 'checkbox';

/**
* Checks if an input is a `select` with the `multiple` attribute.
* @param  {Element} element  the element to check
* @return {Boolean}          true if the element is a multiselect, false if not
*/
const isMultiSelect = element => element.options && element.multiple;

/**
* Retrieves the selected options from a multi-select as an array.
* @param  {HTMLOptionsCollection} options  the options for the select
* @return {Array}                          an array of selected option values
*/
const getSelectValues = options => [].reduce.call(options, (values, option) => {
  return option.selected ? values.concat(option.value) : values;
}, []);

/**
* Retrieves input data from a form and returns it as a JSON object.
* @param  {HTMLFormControlsCollection} elements  the form elements
* @return {Object}                               form data as an object literal
*/
export const formToJSON = elements => [].reduce.call(elements, (data, element) => {
  // Make sure the element has the required properties and should be added.
  if (isValidElement(element) && isValidValue(element)) {
    /*
		* Some fields allow for more than one value, so we need to check if this
		* is one of those fields and, if so, store the values as an array.
		*/
    if (isCheckbox(element)) {
      data[element.id] = (data[element.id] || []).concat(element.value);
    } else if (isMultiSelect(element)) {
      data[element.id] = getSelectValues(element);
    } else {
      data[element.id] = element.value;
    }
  }

  return data;
}, {});



/**
* A handler function to prevent default submission and run our custom script.
* @param  {Event} event  the submit event triggered by the user
* @return {void}
*/
//handleFormSubmit = event => {

  //// Stop the form from submitting since we’re handling that with AJAX.
  //event.preventDefault();

  //// Call our function to get the form data.
  //const data = formToJSON(form.elements);

  //// Demo only: print the form data onscreen as a formatted JSON object.
  //const dataContainer = document.getElementsByClassName('results__display')[0];

  //// Use `JSON.stringify()` to make the output valid, human-readable JSON.
  //dataContainer.textContent = JSON.stringify(data, null, "  ");

  //// ...this is where we’d actually do something with the form data...
//};

/*
* This is where things actually get started. We find the form element using
* its class name, then attach the `handleFormSubmit()` function to the 
* `submit` event.
*/
//const form = document.getElementsByClassName('contact-form')[0];
//form.addEventListener('submit', handleFormSubmit);
