function showCurrencies(array) {
  const table = document.getElementById('table');
  array.forEach((element) => {
    const tableRow = document.createElement('tr');
    tableRow.innerHTML = `<td>${element.Cur_Abbreviation}</td>
    <td>${element.Cur_Name}</td>
    <td>${element.Cur_Scale}</td>
    <td>${element.Cur_OfficialRate}</td>`;
    table.append(tableRow);
  });
}
fetch('https://www.nbrb.by/api/exrates/rates?periodicity=0')
  .then((response) => response.json())
  .then((data) => showCurrencies(data));
