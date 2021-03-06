# Memorizer
**Version 1.0.2**

The manager of your fading memories.
https://xmliszt.github.io/memorizer

##  What's New

Version 1.0.1

- Added categorization feature for memory. Now you can categorize your memory and revise them separately!
- Optimized Firebase authentication to fix an issue where unauthenticated is detected when user is already logged in.

Version 1.0.2

- Added search bar for memories. Now you can search to find the memory you want quickly!
- Added "ongoing" and "completed" category filter. You can show your completed memories and incompleted memories separately!

## Introduction

Memorizer is a Vue website running on GitHub Page that uses Google Firestore as database. It uses the [Ebbinghaus Forgetting Curve](https://en.wikipedia.org/wiki/Forgetting_curve) to auto-calculate your revision schedule.

You can create two types of revision cards:

1. Q&A: the standard type of revision card that provides a question and an answer.
2. Link: special revision card which accepts a valid URL as the resource. When you revise this kind of card, simply click the link to be directed to the source. **If your link is a YouTube video link, it can be played on the website itself as embedded link**

## How to use Memorizer?

Here is a detailed screenshoted examples to guide you through the application:

![1](./src/assets/1.jpg)

![2](./src/assets/2.jpg)

![3](./src/assets/3.jpg)

![4](./src/assets/4.jpg)

![5](./src/assets/5.jpg)

![6](./src/assets/6.jpg)

![7](./src/assets/7.jpg)

[**Version 1.0.1**] You can add categories to your memory now!

![](./src/assets/8.jpg)

![](./src/assets/9.jpg)

![](./src/assets/10.jpg)

## Contributions

Memorizer is welcoming more talented minds to help make it better! To contribute, please fork this repo and submit an **issue** or **pull request**. Thank you for your support!

---
## Contributors
- Li Yuxuan <xmliszt@gmail.com>
---

## License & copyright

© Li Yuxuan, Singapore University of Technology and Design

Licensed under the [MIT License](LICENSE).