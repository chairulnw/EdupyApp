export const questions1 = [
    {
        question: 'Apa output dari program ini?<br><pre><code>number=2<br>print(number+number+number)</code></pre>',
        options: ['6', 'numbernumbernumber', 'Syntax Error'],
        correctAnswer: '6'
    },
    {
        question: 'Dibawah ini adalah program untuk mengubah satuan detik menjadi satuan jam<br><pre><code>seconds = 14926<br><br>hours = seconds (A) 3600<br>leftover_seconds = seconds (B) 3600<br>minutes = leftover_seconds (C) 60<br>final_seconds = leftover_seconds (D) 60<br><br>print(str(hours) , "hours," , minutes  , "minutes, and" , final_seconds , "seconds")</code></pre><br>operasi apa yang benar untuk A, B, C, dan D?',
        options: ['%, //, %, //', '//, %, //, %', '//, //, %, %'],
        correctAnswer: '//, %, //, %'
    },
    {
        question: 'Apa output dari program ini?<br><pre><code>num = 3<br>num = num + num<br>num = num * 2 <br>print(num)</code></pre>',
        options: ['3', '6', '12'],
        correctAnswer: '12'
    },
];
export const questions2 = [
    {
        question: '<pre><code>if x > 5:<br>   print("banyak)<br>else:<br>   print("dikit")</code></pre><br>Jika x = 5, apa outputnya?',
        options: ['banyak', 'dikit', 'Tidak ada output'],
        correctAnswer: 'dikit'
    },
    {
        question: '<pre><code>if z % 2 == 0:<br>   print(____A_____)<br>else:<br>   print(_____B____)</code></pre><br> kata apa yang cocok untuk bagian A dan B?',
        options: ['Positif dan Negatif', 'Genap dan Ganjil','Besar dan Kecil'],
        correctAnswer: 'Genap dan Ganjil'
    },
    {
        question: '<pre><code>x = 5<br>y = 10<br>if x > 10 or y > 5:<br>    print("Salah satu atau kedua kondisi benar")<br>else:<br>    print("Kedua kondisi salah")</code></pre><br> Apa output dari kode ini?',
        options: ['Salah satu atau kedua kondisi benar', 'Kedua kondisi salah', 'Tidak ada output'],
        correctAnswer: 'Salah satu atau kedua kondisi benar'
    },
];

export const questions3 = [
    {
        question: 'Apa output dari kode berikut?<br><pre><code>for letter in "hello":<br>   print(letter)</code></pre>',
        options: ['h, e, l, l, o', '"hello"', 'Tidak ada output'],
        correctAnswer: 'h, e, l, l, o'
    },
    {
        question: 'Apa output dari kode berikut?<br><pre><code>num=10<br>for i in range 4<br>   num = num-i<br>print(num)</code></pre>',
        options: ['10', '7', '3'],
        correctAnswer: '3'
    },
    {
        question: 'Apa output dari kode berikut?<br><pre><code>i = 0<br>while i < 3:<br>   print(i)<br>   i+=1</code></pre>',
        options: ['1, 2, 3', '0, 1, 2', 'i, i, i'],
        correctAnswer: '0, 1, 2'
    },
];
