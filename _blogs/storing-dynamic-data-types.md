---
title: A Beginner's Guide to Storing Dynamic Data Types in C++
date: 2025-01-13 15:42:00 +0100
tags: [cpp, visual-scripting, breda-university]
thumbnail: /assets/img/blogs/storing_dynamic_variables/buas_logo.png
---

I am a second year student at [BUAS](https://www.buas.nl/en) and this is my blog post on how to store dynamically store any data type in a class.

## The problem

Imagine wanting to store a type of data in class, but you don't know beforehand what type of data this is going to be beforehand. For whatever reason your class needs to handle multiple different types dynamically. For example, if you build a visual scripting language (VSL) where the pins of nodes need to be able to store a dynamic type, how would you do it? 

## Possible solutions

### std::variant

#### Explanation

A `std::variant` is basically a type-safe union, which means it can store one of several types at a time. Unlike a normal union, where you can access the stored data as any data type of that union. With a `std::variant` you can only access the data as the currently stored type. Another advantage of `std::variant` is that the types are fixed at compile time. This is helpful because it will throw an error if you have a type mismatch when compiling, letting the user know that they set the `std::variant` to a undefined type. In order to get the current data you would use `std::get<>()`, you can also check if the `std::variant` holds a certain type by doing `std::holds_alternative<>()`.

The good thing about an `std::variant` is that is that it is designed so you don't accidentally get the wrong type, which can prevent unexpected errors. 

A downside however is that a `std::variant` can only store the types defined at compile time. This means that you need to have an idea of what kinds of data types you want to store beforehand.

#### Implementation

[Example reference from cppreference.com](https://en.cppreference.com/w/cpp/utility/variant)
```cpp
#include <cassert>
#include <variant>

int main()
{
  std::variant<int, float> v;
  v = 42; // v contains int
  int i = std::get<int>(v); // succeeds
  
  // std::get<float>(v); // fails because v is currently int
  // should first set v to type float
  v = 42.0f; // v contains float
  float f = std::get<float>(v); // succeeds

  // assert(std::holds_alternative<bool>(v)); // fails because bool is not part of the variant
  assert(std::holds_alternative<int>(v)); // succeeds
  
  return 0;
}
```

### std::any

#### Explanation

A `std::any` can also store multiple types dynamically, however unlike `std::variant` `std::any` can store any type (as the name implies). It is a lot more flexible then `std::variant` but that also comes with some safety concern's. For one it does not throw an error at compile time, so if you `std::any_cast` to the wrong type, the program will throw an run-time error crashing the entire application. Because of this you need to know the type that is currently being stored in the any to actually use the data. Depending on the implementation this could be a major downside, as we want to dynamically store data types and use that data.

#### Implementation

[Example reference from cppreference.com](https://en.cppreference.com/w/cpp/utility/any)
```cpp
#include <any>
#include <iostream>

int main()
{
  std::any a = 42;
  a = 42; // a contains int
  std::cout << std::any_cast<int>(a) << '\n' // succeeds
  // std::cout << std::any_cast<float>(a) << '\n' // fails because stored type is int

  a = 42.0f; // a contains float
  std::cout << std::any_cast<float>(a) << '\n' // succeeds

  return 0;
}
```

### template

#### Explanation

Another way to store a dynamic type is using template classes. Using a template class you can store that data type in the class by creating a member variable with the type that the template is (usually referred to as `T` or `Type`). Besides that using a template is also very save because the type gets defined at compile time, make you not have to check the type at run-time. This can prevent run-time errors and thus application crashes. The downside of this however is just like `std::variant` the types need to be predefined at compile time.

#### Implementation

```cpp
#include <string>

template <typename T>
struct Data 
{
  T data;
}

int main()
{
  Data<int> i{42};
  Data<std::string> s{"string"};

  int n = 7 + i.data; // r is now 49
  std::string r = s.data + " data"; // r is now "string data"

  return 0;
}
```

## Comparison

|                    | `std::variant`                                           | `std::any`                                      | Templated Classes                                                    |
| ------------------ | -------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------- |
| **Type Safety**    | Compile-time safety                                      | Runtime type-checking                           | Compile-time safety                                                  |
| **Performance**    | Compile-time memory allocation (to the largest type).    | Slower (might dynamically allocate memory).     | Compile-time memory allocation.                                      |
| **Ease of Use**    | Moderately difficult to work with.                       | Very easy to work with.                         | Very simple to work with.                                            |
| **Error Handling** | Throws a compile-time error if there is a type mismatch. | Throws run-time error if `std::any_cast` fails. | Compile-time error because the data type is defined at compile time. |
| **Flexibility**    | Less flexible, types are defined at compile time.        | Can handle any type of data.                    | Limited to the defined type.                                         |

## Result

In the end the best way to store the data depends on your situation. 

`std::variant` are useful if you have a few set data types you want to store, on top of that is is also compile time safe so you can let the potential user know they did something wrong before the application starts. 

`std::any` is useful if you the flexibility of the data type is more important, you can obviously now run into run-time errors if you don't handle the data properly. 

Templated classes are useful in case you know the type at compile time and a single instance of the class does not need to store multiple types. 

Depending on the situation you might want to even combine multiple approaches. 