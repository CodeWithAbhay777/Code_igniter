export const starterCode = {
    python: `print("Hello, World!")`,
    javascript: `console.log("Hello, World!");`,
    bash: `echo "Hello, World!"`,
    java: `public class HelloWorld {
        public static void main(String[] args) {
            System.out.println("Hello, World!");
        }
    }`,
    c: `#include <stdio.h>

int main() {
    printf("Hello, World!");
    return 0;
}`,
    cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
    go: `package main
import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
    rust: `fn main() {
    println!("Hello, World!");
}`,
    ruby: `puts "Hello, World!"`,
    php: `<?php
echo "Hello, World!";
?>`,
    swift: `import Foundation

print("Hello, World!")`,
    kotlin: `fun main() {
    println("Hello, World!")
}`,
    haskell: `main :: IO ()
main = putStrLn "Hello, World!"`,
    dart: `void main() {
    print("Hello, World!");
}`
};
