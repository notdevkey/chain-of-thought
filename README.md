# Manufacturing process simulation
By team **Chain of thought**

**Have you ever seen manufacturing software that enables collaboration?**

Streamline all your manufacturing processes through Miro. Collaborate with your teammates, get estimates, and scale.

With the power of Miro mindmaps, comes great power, but yeah responsibility, too, I suppose.
![image](https://github.com/notdevkey/chain-of-thought/assets/66126144/9b596ab1-8bca-43cf-87f5-db30874da023)


## Running locally

1. Clone the repository
```
git clone https://github.com/notdevkey/chain-of-thought.git
```

2. Install dependencies

```
pnpm install
```
```
cd apps/simulation && pip install -r requirements.txt
```

3. Run the project

```
cd apps/sdk && pnpm start
```
```
cd apps/simulation && python manage.py migrate && python manage.py runserver
```
```
cd apps/api && cargo run
```

4. Connect the app to Miro

> Make sure you have a Miro [developer team](https://developers.miro.com/docs/create-a-developer-team) set up before proceeding.

Go to [your Miro apps](https://developers.miro.com/#your-apps) and create a new app

![image](https://github.com/notdevkey/chain-of-thought/assets/66126144/48ec5d67-f154-4597-911f-e9d3af86942c)

![image](https://github.com/notdevkey/chain-of-thought/assets/66126144/07d9d805-f058-4088-9ca3-af56f12987c6)

Set the App URL to `http://localhost:3000` and make sure to give the app read & write permissions to the board.

![image](https://github.com/notdevkey/chain-of-thought/assets/66126144/24d4bc11-7995-4a3d-9773-2d10cfa36a3f)

Then scroll down, click on "Install app and get OAuth token" and add the app to your team.

![image](https://github.com/notdevkey/chain-of-thought/assets/66126144/873f15cb-ec5f-4e59-a748-2c0125f77312)

That's it! You've set up the app, now you can create a board inside your developer team and use it.



