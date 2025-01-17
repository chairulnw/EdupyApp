export const questions1 = [
    {
        question: 'Apa output dari program ini?',
        code: `number=2\nprint(number+number+number)`,
        options: ['6', 'numbernumbernumber', 'Syntax Error'],
        correctAnswer: '6'
    },
    {
        question: 'Dibawah ini adalah program untuk mengubah satuan detik menjadi satuan jam',
        code: `seconds = 14926\n\nhours = seconds // 3600\nleftover_seconds = seconds % 3600\nminutes = leftover_seconds // 60\nfinal_seconds = leftover_seconds % 60\n\nprint(str(hours) , "hours," , minutes  , "minutes, and" , final_seconds , "seconds")`,
        options: ['%, //, %, //', '//, %, //, %', '//, //, %, %'],
        correctAnswer: '//, %, //, %'
    },
    {
        question: 'Apa output dari program ini?',
        code: `num = 3\nnum = num + num\nnum = num * 2\nprint(num)`,
        options: ['3', '6', '12'],
        correctAnswer: '12'
    },
];

export const questions2 = [
    {
        question: 'Jika x = 5, apa outputnya?',
        code: `if x > 5:\n   print("banyak")\nelse:\n   print("dikit")`,
        options: ['banyak', 'dikit', 'Tidak ada output'],
        correctAnswer: 'dikit'
    },
    {
        question: 'kata apa yang cocok untuk bagian A dan B?',
        code: `if z % 2 == 0:\n   print(____A_____) \nelse:\n   print(_____B____)`,
        options: ['Positif dan Negatif', 'Genap dan Ganjil', 'Besar dan Kecil'],
        correctAnswer: 'Genap dan Ganjil'
    },
    {
        question: 'Apa output dari kode ini?',
        code: `x = 5\ny = 10\nif x > 10 or y > 5:\n    print("Salah satu atau kedua kondisi benar")\nelse:\n    print("Kedua kondisi salah")`,
        options: ['Salah satu atau kedua kondisi benar', 'Kedua kondisi salah', 'Tidak ada output'],
        correctAnswer: 'Salah satu atau kedua kondisi benar'
    },
];

export const questions3 = [
    {
        question: 'Apa output dari kode berikut?',
        code: `for letter in "hello":\n   print(letter)`,
        options: ['h, e, l, l, o', '"hello"', 'Tidak ada output'],
        correctAnswer: 'h, e, l, l, o'
    },
    {
        question: 'Apa output dari kode berikut?',
        code: `num=10\nfor i in range(4):\n   num = num - i\nprint(num)`,
        options: ['10', '7', '3'],
        correctAnswer: '3'
    },
    {
        question: 'Apa output dari kode berikut?',
        code: `i = 0\nwhile i < 3:\n   print(i)\n   i+=1`,
        options: ['1, 2, 3', '0, 1, 2', 'i, i, i'],
        correctAnswer: '0, 1, 2'
    },
];
