class ColorsHelper {
    constructor(){
        this.colors = [
            {
                color: 'rgba(255, 99, 132, 0.2)',
                border: 'rgba(255, 99, 132, 1)',
            },
            {
                color: 'rgba(54, 162, 235, 0.2)',
                border: 'rgba(54, 162, 235, 1)',
            },
            {
                color: 'rgba(255, 206, 86, 0.2)',
                border:  'rgba(255, 206, 86, 1)',
            },
            {
                color: 'rgba(75, 192, 192, 0.2)',
                border: 'rgba(75, 192, 192, 1)',
            },
            {
                color: 'rgba(153, 102, 255, 0.2)',
                border:  'rgba(153, 102, 255, 1)',
            },
            {
                color: 'rgba(255, 159, 64, 0.2)',
                border: 'rgba(255, 159, 64, 1)',
            },
         
        ]
    }

    getColor(index){
        return this.colors[index % this.colors.length];
    }
}

export default ColorsHelper;