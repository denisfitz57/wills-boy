# Deploying Memoir Explorer to GitHub Pages

I have already configured your project with the necessary scripts. Follow these steps to deploy your site:

### 1. Create a Repository on GitHub
1.  Go to [GitHub.com](https://github.com) and sign in.
2.  Click the **+** icon in the top right and select **New repository**.
3.  Name it (e.g., `memoir-explorer` or `wills-boy`).
4.  Make sure it is **Public** (GitHub Pages is free for public repos).
5.  Do **not** initialize with README, .gitignore, or license (you already have a project).
6.  Click **Create repository**.

### 2. Push Your Code to GitHub
Open your terminal (or VS Code terminal) in the project folder and run these commands one by one:

```bash
# Add all files to the first commit
git add .

# Create the first commit
git commit -m "Initial commit of Memoir Explorer"

# Link your local project to the GitHub repo (REPLACE WITH YOUR URL!)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename branch to main (standard practice)
git branch -M main

# Push your code
git push -u origin main
```

### 3. Deploy the Site
Now, deploy the optimized production build to GitHub Pages:

```bash
npm run deploy
```

This command will:
1.  Build your app (create the `dist` folder).
2.  Publish that `dist` folder to a special `gh-pages` branch on GitHub.

### 4. Enable GitHub Pages
1.  Go to your repository on GitHub.
2.  Click **Settings** tab.
3.  On the left sidebar, click **Pages**.
4.  Under **Build and deployment** > **Source**, ensure "Deploy from a branch" is selected.
5.  Under **Branch**, select `gh-pages` and `/ (root)`. (This might happen automatically after step 3).
6.  Click **Save** if needed.

Your site will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

### Updating the Site
Whenever you make changes in the future:
1.  Commit your changes: `git add .` then `git commit -m "Description"`
2.  Push: `git push`
3.  Redeploy: `npm run deploy`
