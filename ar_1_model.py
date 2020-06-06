
class ar_1_model:
    def __init__(self, yi):
        self.yi = yi
        self.predictions = yi.copy()

        self.y = yi.copy()
        self.y.pop(0)
        
        self.x = yi.copy()
        self.x.pop()

        n = len(self.x)
        
        self.sum_xy = sum([self.x[i] * self.y[i] for i in range(n)])
        
        sum_x = sum(self.x)
        sum_x2 = sum(list(map(lambda u : u ** 2, self.x)))
        sum_y = sum(self.y)
        sum_y2 = sum(list(map(lambda u : u ** 2, self.y)))

        SS = lambda v, v2, n : v2 - n * (v / n)**2

        self.SSx = SS(sum_x, sum_x2, n)
        self.SSy = SS(sum_y, sum_y2, n)
        self.SSxy = self.sum_xy - n * (sum_x / n) * (sum_y / n)

        self.b1 = self.SSxy/self.SSx
        self.b0 = (sum_y / n) - self.b1 * (sum_x / n)

        print(self.b1, self.b0)

        # model: y(t) = b0 + b1 * y(t-1)

    # returns R^2
    def sample_coefficient_determination(self):
        return (self.SSxy**2 / self.SSx) / self.SSy
    
    # returns mse (s^2)
    def mean_square_error(self):
        # model + error = total
        error = self.SSy - (self.SSxy**2 / self.SSx)

        df = len(self.x) - 2
        return error / df

    # if in range of dataset, return value of dataset, otherwise use ar(1) model to predict next values
    def predict(self, i):#
        if i > (len(self.predictions) - 1):
            for n in range(len(self.predictions), i + 1):
                self.predictions.append(self.b0 + self.b1 * self.predictions[len(self.predictions) - 1])

        return self.predictions[i]

if __name__ == '__main__':
    a = ar_1_model([6.05, 6.78, 7.89, 3.56, 7.47, 4.51, 6.91, 3.38, 8.07, 4.45, 8.19, 4.35])
    
    print('R^2=', a.sample_coefficient_determination())
    print('MSE=', a.mean_square_error(), end='\n\n')


    print(a.predict(30))

    for x in range(31):
        print((x, a.predict(x)))
