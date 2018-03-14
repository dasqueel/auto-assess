# auto-assess
An api that scores your understanding of a question through a youtube screencast video.  E.x. do a screen cast answering "how to reverse a linked list" and you will receive a score on how well you did.  The score is calculated from comparing your videos transcript to other accepted screens casts that answer the question, e.x. (A khan Academy or geekforgeeks video)

# demo / overview
[Youtbe Demo](https://www.youtube.com/watch?v=NXbkYUl_Zmo)

# try it out
Enter a youtube video id that answers the question; How to reverse a linked list?
replace `<THE YOUTUBE VIDEO ID HERE>` with your video ID.
```
curl -X POST -d '{"vidId":"<THE YOUTUBE VIDEO ID HERE>","question":"how to reverse a linked list"}' -H "Authorization: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1YWE5N2ZlNzBjOTZlMDAwMDQ4MDRlNDYiLCJpYXQiOjE1MjEwNTc4NDd9.Faw3pgsAxKLm48znLaAQWQ2hmxqYBNogClM795llbYQ" -H "Content-Type: application/json" https://auto-assess.herokuapp.com/api/v1/assess
```

Expect a json reponse with data about your assessment, e.x. important words you said, simliar words other users used, and your transcript breakdown.
