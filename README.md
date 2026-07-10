# Tech Task for BrightHR by Angi Watt

This project was created as a junior-and-middleweight dev tech task by BrightHR, built according to the following
specifications:\
https://github.com/brighthr/Front-End-Tech-Tasks/blob/main/junior-and-middleweight.md. \
I pledge that all the work produced here is written entirely using my own knowledge and openly-available documentation,
and made without the use of generative AI.

## Viewing deployment

This app has been deployed via Github Pages, and should be viewable from
[https://angusjwatt.github.io/brighthr-tech-task/](https://angusjwatt.github.io/brighthr-tech-task/).

## How to run

To run this code, pull this repository and run the terminal command `npm start` within this project, which will open the
app in development mode in the browser at [http://localhost:3000](http://localhost:3000). To change which files are
being shown, alter them from `/public/filepaths.json`. \
To run tests, run the terminal command `npm test` within the project, with the additional flag `-- --coverage` in order
to generate a coverage report.

## What else I would like to have done

This task was a balance between generating a minimal viable product that met all the requirements versus an application
that had all the features I would have liked to have added.\
Currently, there is no way to view the contents of files (assuming that there would have been contents to read from the
"API"). I would have liked to have included a link along with the file in the table which, when clicked, would have
either opened up the file in a modal or else provided an option to download the file.\
I made the buttons for the table-headers display as buttons, but I don't think that they are very visaully appealing. I
would like to explore options of styling them which doesn't deviate too much from expected HTML behaviour but which
makes them more attractive.\
I would like to have had a screen-reader to test my application with, as my current setup does not have one included. I
had to make do with resources such as MDN and W3C for WCAG guidelines and Chrome's built-in Lighthouse. Where possible,
I have avoided ARIA and have kept to native, semantic HTML, but this has led to some concerns such as buttons being
verbose, which I might like to address with a UX/UI expert.\
I visually checked my application on Chrome and Firefox on my laptop and on Chrome on my android phone, but I would
have liked to have used Safari and Edge and other devices too to see if there were any deviations in styling between
them.\
I would like to have written some tests in an end-to-end framework such as Playwright, so that I could describe a small
user journey such as a user who loads the application, waits for it to load, and then clicks around on some buttons.\
My unit-tests are not very readable, and I would like to rename some of the variables to make clear what I am testing
and why.\
I was unable to unit-test for error behaviours in my application, as throwing an error triggered the event for the test
to stop running. Where possible, I manually tested around this issue, and provided comments on how to do likewise, but
it still means that there is a section of my code marked as uncovered. I would have liked to investigate further how to
overcome this.\
I used Github Pages to deploy and host my app. However, an issue in its build process means that it treats relative
imports in the index.html file as coming from my base user page,
[https://angusjwatt.github.io/](https://angusjwatt.github.io/), rather than from this project at
[https://angusjwatt.github.io/brighthr-tech-task/](https://angusjwatt.github.io/brighthr-tech-task/). To fix this, I had
to use absolute imports in my index.html file. This is fragile, however, as any build is likely to change the numerical
string at the end of my JS and CSS imports. I would liked to have figured out a way to not have the numerical string or,
more ideally, addressed the build issue within Github Pages so that relative import issue was resolved.\
I would maybe have liked to move some of the functions out of DirectoryTable an into their own files to test them in
isolation.\
I am concerned that the behaviour for the CWDList component is not very well communicated. It relies on the
assumption that the user would understand that the current directory will update as the user moves through the
directories, and that clicking on a directory will bring it back to that point.\
The current behaviour when navigating through the app is to sort through all of the files before presenting them to the
user. This works fine currently, and wouldn't be a problem for up to a hundred or so directories, but is not largely
scalable. Ideally, I would like to investigate ways to minimise the amount of file data that needs to be loaded per
page, maybe by fetching and caching only nodes nearby to the current directory and its parents back to HOME.\ 
There is currently no behaviour for emulating symlinks, which might be nice to have. These could be treated in just the
same way as navigating to a directory.\
I would have liked to have structured my components in an MVC structure, and implemented the dependency-inversion
principle more rigourously. I was sometimes over-eager to implement structures in lower components before the components
that imported them required it, meaning some hefty refactors which often required disentangling logical elements from
presentational ones.\
Finally, the app is not very pretty. I would maybe have liked to have consulted with someone with more flare for
decoration on how best to style the app.
