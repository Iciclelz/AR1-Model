class AR1Model {
    constructor(yi) {
      this.yi = yi;
      this.predictions = yi.slice(0);

      this.y = yi.slice(1);
      this.x = yi.slice(0);
      this.x.pop();

      let n = this.x.length;

      this.sum_xy = 0;
      for (let i = 0; i < n; ++i)
      {
        this.sum_xy += this.x[i] * this.y[i];
      }

      let sum = (a, b) => a + b;
      
      let sum_x = this.x.reduce(sum, 0);
      let sum_x2 = this.x.map(u => u **2).reduce(sum, 0);
      let sum_y = this.y.reduce(sum, 0);
      let sum_y2 = this.y.map(u => u **2).reduce(sum, 0);

      console.log(sum_x, sum_x2, sum_y, sum_y2);

      let SS = (v, v2, n) => v2 - n * (v / n)**2;

      this.SSx = SS(sum_x, sum_x2, n);
      this.SSy = SS(sum_y, sum_y2, n);
      this.SSxy = this.sum_xy - n * (sum_x / n) * (sum_y / n);

      console.log(this.SSx, this.SSy, this.SSxy);

      this.b1 = this.SSxy/this.SSx;
      this.b0 = (sum_y / n) - this.b1 * (sum_x / n);

      console.log(this.b1, this.b0);

      // model: y(t) = b0 + b1 * y(t-1)
    }
    
    // returns R^2
    SampleCoefficientDetermination() {
      return (this.SSxy**2 / this.SSx) / this.SSy;
    }
    
    // returns MSE (s^2)
    MeanSquareError() {
        // model + error = total
        let error = this.SSy - (this.SSxy**2 / this.SSx);

        let df = this.x.length - 2;
        return error / df;
    }

    Predict(i) {

      if (i > this.predictions.length - 1) {
        for (let n = this.predictions.length; n < i + 1; ++n) {
          this.predictions.push(this.b0 + this.b1 * this.predictions[this.predictions.length - 1]);
        }
      }

      return this.predictions[i];
    }
  }


const main = () => {
    let a = new AR1Model([6.05, 6.78, 7.89, 3.56, 7.47, 4.51, 6.91, 3.38, 8.07, 4.45, 8.19, 4.35])
    
    console.log('R^2=', a.SampleCoefficientDetermination())
    console.log('MSE=', a.MeanSquareError())


    console.log(a.Predict(30))

    for (let x = 0; x < 31; ++x) {
        console.log(x, a.Predict(x))
    }
};


main();
