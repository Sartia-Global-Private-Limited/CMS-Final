export function printDiv(divId) {
  let originalContents = document.body.innerHTML;
  let printContents = document.getElementById(divId).innerHTML;
  document.body.innerHTML = printContents;
  window.print();
  window.setTimeout(function () {
    window.location.reload();
  }, 1);
}
