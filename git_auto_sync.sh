#!/bin/bash

commit_name="$(hostname): auto-sync-$(date +'%Y-%m-%d %H:%M:%S')"
branch="main"

# fetch updates
git fetch origin

# make sure that the branch exists
if ! git show-ref --quiet refs/heads/"$branch"; then
    echo "Branch $branch does not exist."
    exit 1
fi

echo "Pulling from ${branch}"
git pull -q origin "$branch" || { echo "Failed to pull from $branch"; exit 1; }

echo "Adding . to a new commit called ${commit_name}"
git add .

# if there are no changes, why push
if git diff --cached --quiet; then
    echo "No changes to commit."
    exit 1
fi

echo "Pushing commit with name \"${commit_name}\""
git commit -q -m "$commit_name"

echo "Pushing commit \"${commit_name}\" to branch \"${branch}\""
git push -q origin "$branch"