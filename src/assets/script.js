$('#amount-slider').slider();
$('#temperature-slider').slider()
let isSendingRequest = false;
let imageHolder = $('#images-list');
let loadingIcon = $('#loading-icon');
let results = $('#results');
let resultsObject = [];
$('#send-request').on('click', function (event) {
  if (isSendingRequest) {
    return
  }
  let form = $('#params');
  console.log('Starting checking');
  if (!form.valid()) {
    return
  }
  console.log('Sending request');
  isSendingRequest = true;
  this.disabled = true;
  loadingIcon.removeClass('hidden');
  results.addClass('hidden');
  event.preventDefault();
  let params = form.serialize();
  console.log(params);
  $.ajax({
    method: 'GET',
    url: `api?${params}`,
  }).then(response => {
    isSendingRequest = false;
    this.disabled = false;
    loadingIcon.addClass('hidden');
    results.removeClass('hidden');
    const { output_dir } = response
    const resultHolder = $('#results');
    const result = new Result({
      outputDir: output_dir,
      ...response
    });

    // Disable other rows
    $('.result-table-row').removeClass('active-row');
    // Create and add row to the table
    const data  = result.data;
    jQuery(`
      <tr class="result-table-row">
        <td>${data.id}</td>
        <td>${data.n}</td>
        <td>${data.T}</td>
        <td>${data.volume}</td>
        <td>${data.pressure}</td>
        <td>${data.pv}</td>
      </tr>
    `).on('click', function () {
      result.display(resultHolder);
      $('.result-table-row').removeClass('active-row');
      $(this).addClass('active-row');
    })
      .addClass('active-row')
      .appendTo($('#results-table'));
    $('#results-no-result').hide();

    resultsObject.push(result);
    const button = jQuery(`
        <button
          style="display: block; margin: .5rem auto;"
          class="btn btn-success"
          size="sm"
        >
          Experiment #${resultsObject.length}
        </button>
    `);
    button.on('click', () => {
      result.display(resultHolder);
    }).appendTo($('#history-content'))
    console.log('Results - ', resultsObject)
    result.display(resultHolder);
  }).catch(() => {
    isSendingRequest = false;
    this.disabled = false;
    loadingIcon.addClass('hidden');
  })
});

const collapsibles = $('.collapsible');
collapsibles.filter(b => $(collapsibles[b]).data('collapsed'))
  .css({ display: 'none' })

$('.collapse-button').on('click', function () {
  console.log('Button is ', this);
  const toCollapse = $(this).data('to-collapse');
  const element = $(`#${toCollapse}`);
  const isCollapsed = element.data('collapsed');
  element.data('collapsed', !isCollapsed);
  element.removeClass([ 'active-shrimping', 'active-growing' ]);
  element.css({ height: `${element.height()}px`});
  setTimeout(() => {
    element.addClass(`active-${isCollapsed ? 'growing' : 'shrimping'}`);
  }, 0)
});
