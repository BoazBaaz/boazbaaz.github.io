---
title: Storing Dynamic Data Types for Visual Scripting Pins
date: 2025-01-13 15:42:00 +0100
project: visual-scripting
status: done
tags: [cpp, engine, visual-scripting, buas]
thumbnail: /assets/img/projects/visual-scripting/thumbnail.png
---

The pins on the nodes of my [visual scripting language](/projects/visual-scripting/) need to be able to store any data type, an `int`, a `float`, a `Transform`, whatever the node works with. This post compares three ways to store a dynamic data type in a class in C++, `std::variant`, `std::any` and templates, and then goes through how my pins actually changed during the project, and why they ended up as templates.

## The problem

Imagine wanting to store a type of data in a class, but you don't know beforehand what type of data this is going to be beforehand. For whatever reason your class needs to handle multiple different types dynamically. For example, if you build a visual scripting language (VSL) where the pins of nodes need to be able to store a dynamic type, how would you do it? 

### std::variant

A `std::variant` is basically a type-safe union, which means it can store one of several types at a time. Unlike a normal union, where you can access the stored data as any data type of that union. With a `std::variant` you can only access the data as the currently stored type. Another advantage of `std::variant` is that the types are fixed at compile time. This is helpful because it will throw an error if you have a type mismatch when compiling, letting the user know that they set the `std::variant` to a undefined type. In order to get the current data you would use `std::get<>()`, you can also check if the `std::variant` holds a certain type by doing `std::holds_alternative<>()`.

The good thing about an `std::variant` is that it is designed so you don't accidentally get the wrong type, which can prevent unexpected errors. 

A downside however is that a `std::variant` can only store the types defined at compile time. This means that you need to have an idea of what kinds of data types you want to store beforehand.

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

A `std::any` can also store multiple types dynamically, however unlike `std::variant` `std::any` can store any type (as the name implies). It is a lot more flexible then `std::variant` but that also comes with some safety concern's. For one, it does not throw an error at compile time, so if you `std::any_cast` to the wrong type, the program will throw a run-time error crashing the entire application. Because of this you need to know the type that is currently being stored in the `std::any` to actually use the data. Depending on the implementation this could be a major downside, as we want to dynamically store data types and use that data.

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

Another way to store a dynamic type is using template classes. Using a template class you can store that data type in the class by creating a member variable with the type that the template is (usually referred to as `T` or `Type`). Besides that using a template is also very safe because the type gets defined at compile time, making you not have to check the type at run-time. This can prevent run-time errors and thus application crashes. The downside of this however is just like `std::variant` the types need to be predefined at compile time.

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
|--------------------|----------------------------------------------------------|-------------------------------------------------|----------------------------------------------------------------------|
| **Type Safety**    | Compile-time safety                                      | Runtime type-checking                           | Compile-time safety                                                  |
| **Performance**    | Compile-time memory allocation (to the largest type).    | Slower (might dynamically allocate memory).     | Compile-time memory allocation.                                      |
| **Ease of Use**    | Moderately difficult to work with.                       | Very easy to work with.                         | Very simple to work with.                                            |
| **Error Handling** | Throws a compile-time error if there is a type mismatch. | Throws run-time error if `std::any_cast` fails. | Compile-time error because the data type is defined at compile time. |
| **Flexibility**    | Less flexible, types are defined at compile time.        | Can handle any type of data.                    | Limited to the defined type.                                         |

## Result

In the end the best way to store the data depends on your situation. 

`std::variant` are useful if you have a few set data types you want to store, on top of that it is also compile time safe so you can let the potential user know they did something wrong before the application starts. 

`std::any` is useful if the flexibility of the data type is more important, you can obviously now run into run-time errors if you don't handle the data properly. 

Templated classes are useful in case you know the type at compile time and a single instance of the class does not need to store multiple types. 

Depending on the situation you might want to even combine multiple approaches. 

## How my pins changed

In the visual scripting language a node has input and output pins, and a connection between two pins passes the data from one node to the next. My pins changed three times during the project.

### Data in the pin

In the first version the data lived inside the pin itself, and a node got and set it through the pin by name:

```cpp
void Execute() override
{
    const auto input1 = GetPin("Input1", true).GetData<int>();
    const auto input2 = GetPin("Input2", true).GetData<int>();

    if (input1 && input2)
    {
        const int result = input1 + input2;
        GetPin("Result", false).SetData<int>(result);
    }
}
```

It worked, but I wanted creating new nodes to be cleaner.

### Data on the node

So next I moved the data to the node as normal member variables, and a pin just pointed to it. A new node became a lot cleaner to write:

```cpp
class MathNode : public BaseNode
{
public:
    MathNode() : BaseNode("MathNode")
    {
        CreatePin("IExecution", true, m_inputFlow);
        CreatePin("OExecution", false, m_outputFlow);
        CreatePin("Input1", true, m_input1);
        CreatePin("Input2", true, m_input2);
        CreatePin("Result", false, m_result);
    }

    void Execute() override { m_result = m_input1 + m_input2; }

private:
    Flow m_inputFlow;
    Flow m_outputFlow;
    int m_input1 = 0;
    int m_input2 = 0;
    int m_result = 0;
};
```

The question then was how an input pin gets the data from the output pin it's connected to. I had three options:

```cpp
// Option 1: point the pin to the data of the connected pin
template <typename Type>
Pin::SetData(Type* data)
{
    m_data = data;
}

// Option 2: overwrite the data the pin points to
template <typename Type>
Pin::SetData(Type data)
{
    *static_cast<Type*>(m_data) = data;
}

// Option 3: always go through the pin to get the data
MathNode::Execute()
{
    m_result = m_input1.GetData() + m_input2.GetData();
}
```

I went with option 2. It's nicer to use than option 3, because inside `Execute` you just use your member variables, and it brings fewer pointer problems than option 1.

### Templated pins

The problem showed up when I started on saving graphs. With the data on the node, I couldn't just save the `BaseNode` anymore. I would also have to save every child class, like `MathNode`, together with the data of its base class, which is hard to do because the nodes are polymorphic.

During a progress meeting with my lecturer and some of my peers, Sjoerd, a classmate of mine, suggested making the pins templated and putting the data back in the pin. That keeps the clean way of writing nodes, and because the pins are stored in the `BaseNode`, saving them becomes easy again. So the pins became a `BasePin` with the shared data, like the name and id, and a templated `Pin<T>` that holds the actual value:

```cpp
class BasePin {
public:
    template <typename Type>
    const Type& GetData() {
        auto* pin = dynamic_cast<Pin<Type>*>(this);
        if (!pin) Log::Critical("Type mismatch in base pin get data!");
        return pin->GetData();
    }
};

template <typename Type>
class Pin : public BasePin {
private:
    Type m_data{};
};
```

A node now has its pins as members and registers them, and because `Pin<Type>` has custom operators, you can use a pin like the data it holds:

```cpp
class MathNode : public BaseNode
{
public:
    MathNode() : BaseNode("MathNode")
    {
        RegisterPin(m_input1);
        RegisterPin(m_input2);
        RegisterPin(m_result);
    }

    void Execute() override { m_result = m_input1 + m_input2; }

private:
    Pin<int> m_input1{"Input1", true, 0};
    Pin<int> m_input2{"Input2", true, 0};
    Pin<int> m_result{"Result", false, 0};
};
```

## What I learned

Every pin now knows its own type at compile time, but getting the data through the `BasePin` is only checked at run-time with a `dynamic_cast`. I would have liked to check that at compile time, but `this` isn't known at compile time. I also planned to use a `static_assert` with the `std::type_index` that the `BasePin` stores, but that is only known at run-time too. So to be safe you check the type first:

```cpp
if (pin->CheckDataType<int>())
{
    const auto data = pin->GetData<int>();
}
```

Funnily enough, saving graphs never made it in. In the last week I dropped serialization, after talking about priorities with my lecturer. With all the connected parts, pointers and templates it had become too big of a mess, and being able to save nodes doesn't help much if not enough of them work yet. So the pins ended up templated for a feature that didn't ship, but the clean way of writing nodes stayed.