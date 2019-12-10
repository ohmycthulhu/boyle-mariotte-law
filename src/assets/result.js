class Result {
  constructor ({ width, height, n, T, output, outputDir, files, status }) {
    Result.id = (Result.id || 0) + 1;
    this.id = Result.id;
    this.width = width;
    this.height = height;
    this.n = n;
    this.T = T;
    this.output = output;
    this.outputDir = outputDir;
    this.files = typeof files === 'object' ? Object.values(files) : files;
    this.status = status;
  }

  get data () {
    return {
      id: this.id,
      width: this.width,
      height: this.height,
      volume: this.volume,
      pressure: this.pressure,
      n: this.n,
      T: this.T,
      pv: this.pv
    }
  }

  get pressure () {
    return parseFloat(this.output);
  }

  get volume () {
    return this.height * this.width;
  }

  get pv () {
    return this.pressure * this.volume;
  }

  display (element) {
    const imagesHolder = $(element).find('#images-list');
    imagesHolder.removeClass('active-growing-slow');
    setTimeout(() => {
      imagesHolder.addClass('active-growing-slow');
    }, 0);
    setTimeout(() => {
      if (imagesHolder[0]) {
        imagesHolder[0].scrollIntoView();
      }
    }, 1500);

    this._displayImages(imagesHolder);
  }

  _displayImages (holder) {
    holder.html('');
    this.files.forEach(image => {
      jQuery(`
        <img
          src="${this.outputDir}/${image}"
          class="col-12 col-md-6 result-image"
          alt="${image}">
        `).appendTo(holder)
    })
  }

}
