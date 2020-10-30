---
title: US Median Income Over Time
date: 2020-10-30T10:48:58-06:00
author: n8henrie
layout: notebook
permalink: /2020/10/us-median-income-over-time/
categories:
- tech
excerpt: ""
# grep -oP '(?<=>Posts tagged with ).*?(?=<)' ~/git/n8henrie.com/_site/tags/index.html
tags:
- datascience
- politics
- python

---
**Bottom Line:** A brief dicussion of median vs mean and look at SSA data on
the US median wage.
<!--more-->

Download this jupyter notebook in runnable format
[here](/uploads/2020/10/medianwage.ipynb) and view the post on my website [here](https://n8henrie.com/2020/10/us-median-income-over-time).

NB: There may be (hopefully minor) edits that are out of sync between the blog
post and the downloaded notebook.


```python
# pip install git+https://github.com/n8henrie/nb_black
# This library automatically runs the `black` code formatter in jupyter cells.
# The n8henrie/nb_black fork is slightly modified to allow specifying a custom
# line length instead of using the default.
import lab_black

lab_black.load_ipython_extension(get_ipython(), line_length=79)
```

# US Median Wage Estimates, 1990-2019

I often hear that the average US citizen has an income of around $50,000 per
year. I hadn't previously seen where this number comes from, but recently I
found that the Social Security Administration provides some pretty interesting
data at their website.

For example, [here](https://www.ssa.gov/OACT/COLA/awi.gif) is the US average
wage index over time (displaying a local copy below):

![](/uploads/2020/10/awi.gif)

I recently discovered that they provide a webapp showing a summary of the US
W-2 reported income. Most interestingly, it includes binned data so one can
look at the changes in specific income brackets over time, and additionally
they provide an estimate of the *median* income as well.

An example URL for the webapp: <https://www.ssa.gov/cgi-bin/netcomp.cgi?year=2003>

## Median vs mean

Something I hadn't considered (for whatever reason) is that discussion on the
state of economic affairs based solely on the *average* income likely
misrepresents how *most* of the US is doing. The *median* income is probably
more representative of what most of us have in mind.

As an example, if we have a population of 100 individuals whose income is
normally distributed from 0 to 10 (choose whatever units you like), the mean
and median tend to be similar:


```python
import matplotlib.pyplot as plt
import numpy as np

rng = np.random.default_rng()
population = rng.normal(loc=5, scale=1.5, size=100)
print(
    f"""First 10 values of population: {population[:10]}

{np.median(population)=}
{np.mean(population)=}
"""
)
plt.hist(population, bins=20, range=[0, 10])
```

    First 10 values of population: [5.37663355 3.77759921 2.8321777  4.88866131 4.02549337 7.890585
     8.07219506 4.30035334 2.18794887 2.15074077]
    
    np.median(population)=4.921754367304535
    np.mean(population)=4.982034011567311
    



![png](/uploads/2020/10/output_3_1.png)


However, if we take *just one* member of the population and make their income
an extreme outlier, the *average* is improved, but the *median* is not
(assuming the outlier was selected from above the median to start with).


```python
population.sort()
initial_median = np.median(population)
initial_mean = np.mean(population)
```


```python
# Make the 49th richest (51st poorest) individual 100 times richer
population[51] *= 100
```


```python
print(
    f"""Average income before: {initial_mean}
Average income after: {np.mean(population)}

Median income before: {initial_median}
Median income after: {np.median(population)}"""
)
```

    Average income before: 4.982034011567312
    Average income after: 9.940573583180026
    
    Median income before: 4.921754367304535
    Median income after: 4.921754367304535


We see that the *average* income of the population has nearly doubled!

While that *sounds* great, the truth of the matter is that *most* of this
population has not actually improved at all.

As a matter of fact, we could even have a situation where all but one lucky
individual see a *decrease* in their income, but the average *still* goes up.


```python
population[:51] *= 0.95
population[52:] *= 0.95
```


```python
print(
    f"""Average income before: {initial_mean}
Average income after: {np.mean(population)}

Median income before: {initial_median}
Median income after: {np.median(population)}"""
)
```

    Average income before: 4.982034011567312
    Average income after: 9.693976195516614
    
    Median income before: 4.921754367304535
    Median income after: 4.675666648939308


In this example, *99%* of the population is 5% *poorer* than they were to start with,
which is reflected by the dropping *median* income, but contrasts starkly with
a near **doubling** of the *average* income of the population.

Hopefully this is old news to most readers, but I think it was worth briefly
reviewing. Statistics matter! Especially when some people in our contry are
worth *hundreds of billions of dollars*, while the [official poverty rate][census]
is more than 10% -- some 33 million people.

[census]: https://www.census.gov/content/dam/Census/library/publications/2020/demo/p60-270.pdf "Income and Poverty in the United States: 2019"

## SSA data vs census data

Before going on to the SSA data, I wanted to point out that the SSA data below
differs *substantially* from the data available from the US Census (and for
fellow nerds, my understanding is that census.gov has a good API -- I look
forward to exploring their data soon!). For example, [their report][census]
shows the 2019 median household income to be about $68,000 -- *much* higher
than the SSA numbers below.

It seems like some of the important differences to keep in mind include:

- census includes *reported* data, the SSA is *measured* (W-2)
- census is *household* data, SSA is *individual*
    - one might expect 2-income households to be roughly twice as much on the census data as compared to SSA
- AFAIK, SSA is *only W-2 income*, meaning that capital gains and income from
  other work will not be reflectedin SSA, but may be included in what is
  reported by individuls in the census data

With that out of the way, on to the numbers!

[census]: https://www.census.gov/content/dam/Census/library/publications/2020/demo/p60-270.pdf "Income and Poverty in the United States: 2019"


```python
# main dependencies for the notebook
import pickle
import re
import typing as t
from urllib.request import urlopen

import altair as alt
import pandas as pd
from sklearn.linear_model import LinearRegression

# NB: you will also need `pyarrow` installed to store and read dataframes from
# feather format. You don't need to import it, but uncomment below to test if
# you have it available.
# import pyarrow
```


```python
# imports and helper function to run doctests
import copy
import doctest


def testme(func):
    """
    Automatically runs doctests for a decorated function.
    https://stackoverflow.com/a/49659927/1588795
    """
    globs = copy.copy(globals())
    globs.update({func.__name__: func})
    doctest.run_docstring_examples(
        func, globs, verbose=False, name=func.__name__
    )
    return func
```


```python
# Build up some regular expressions to parse out the data from the
# relevant paragraphs
MONEY = r"\$[0-9,]+\.[0-9]{2}"
YEAR = r"\d{4}"
mean_re = re.compile(
    (
        'The "raw" average wage, computed as net compensation divided by the '
        f"number of wage earners, is {MONEY} divided by [0-9,]+, or "
        rf"({MONEY})\."
    ).strip()
)

median_re = re.compile(
    (
        "By definition, 50 percent of wage earners had net compensation less "
        "than or equal to the <i>median</i> wage, which is estimated to be "
        rf"({MONEY}) for {YEAR}\."
    ).strip()
)
```


```python
@testme
def clean_number(string) -> float:
    """
    Turn a string of a dollar amount into a float.
    >>> clean_number("$123,456.78")
    123456.78
    """
    return float(string.lstrip("$").replace(",", ""))


def get_year(year: int) -> t.Dict[str, int]:
    """
    Get the median and mean for `year` from SSA.gov.
    """
    with urlopen(
        f"https://www.ssa.gov/cgi-bin/netcomp.cgi?year={year}"
    ) as req:
        resp = req.read().decode()
    clean_whitespace = " ".join(resp.split())

    median = median_re.search(clean_whitespace).group(1)
    mean = mean_re.search(clean_whitespace).group(1)
    return {
        "year": year,
        "median": clean_number(median),
        "mean": clean_number(mean),
    }
```


```python
# If a feather file is available, load the dataframe from the local file.
# Otherwise, query ssa.gov for 1990-2019, create a dataframe, and make a
# local copy in feather format to prevent unnecessary http requests.
try:
    df = pd.read_feather("20201022_ssa_median_income.feather").set_index(
        "year"
    )
except FileNotFoundError:
    df = (
        pd.DataFrame(get_year(year) for year in range(1990, 2020))
        .set_index("year")
        .sort_index()
    )
    df.reset_index().to_feather("20201022_ssa_median_income.feather")
```


```python
alt.Chart(df.reset_index().melt("year")).mark_line().encode(
    x="year:O",
    y=alt.Y("value", axis=alt.Axis(format="$,d", title="income $USD")),
    color=alt.Color("variable", legend=alt.Legend(title=None)),
).properties(title="Source: SSA.gov").interactive()
```





<div id="altair-viz-f701433ea0704237a543b69eb83255e9"></div>
<script type="text/javascript">
  (function(spec, embedOpt){
    let outputDiv = document.currentScript.previousElementSibling;
    if (outputDiv.id !== "altair-viz-f701433ea0704237a543b69eb83255e9") {
      outputDiv = document.getElementById("altair-viz-f701433ea0704237a543b69eb83255e9");
    }
    const paths = {
      "vega": "https://cdn.jsdelivr.net/npm//vega@5?noext",
      "vega-lib": "https://cdn.jsdelivr.net/npm//vega-lib?noext",
      "vega-lite": "https://cdn.jsdelivr.net/npm//vega-lite@4.8.1?noext",
      "vega-embed": "https://cdn.jsdelivr.net/npm//vega-embed@6?noext",
    };

    function loadScript(lib) {
      return new Promise(function(resolve, reject) {
        var s = document.createElement('script');
        s.src = paths[lib];
        s.async = true;
        s.onload = () => resolve(paths[lib]);
        s.onerror = () => reject(`Error loading script: ${paths[lib]}`);
        document.getElementsByTagName("head")[0].appendChild(s);
      });
    }

    function showError(err) {
      outputDiv.innerHTML = `<div class="error" style="color:red;">${err}</div>`;
      throw err;
    }

    function displayChart(vegaEmbed) {
      vegaEmbed(outputDiv, spec, embedOpt)
        .catch(err => showError(`Javascript Error: ${err.message}<br>This usually means there's a typo in your chart specification. See the javascript console for the full traceback.`));
    }

    if(typeof define === "function" && define.amd) {
      requirejs.config({paths});
      require(["vega-embed"], displayChart, err => showError(`Error loading script: ${err.message}`));
    } else if (typeof vegaEmbed === "function") {
      displayChart(vegaEmbed);
    } else {
      loadScript("vega")
        .then(() => loadScript("vega-lite"))
        .then(() => loadScript("vega-embed"))
        .catch(showError)
        .then(() => displayChart(vegaEmbed));
    }
  })({"config": {"view": {"continuousWidth": 400, "continuousHeight": 300}}, "data": {"name": "data-c7065798eda604eaa483399633c61cad"}, "mark": "line", "encoding": {"color": {"type": "nominal", "field": "variable", "legend": {"title": null}}, "x": {"type": "ordinal", "field": "year"}, "y": {"type": "quantitative", "axis": {"format": "$,d", "title": "income $USD"}, "field": "value"}}, "selection": {"selector002": {"type": "interval", "bind": "scales", "encodings": ["x", "y"]}}, "title": "Source: SSA.gov", "$schema": "https://vega.github.io/schema/vega-lite/v4.8.1.json", "datasets": {"data-c7065798eda604eaa483399633c61cad": [{"year": 1990, "variable": "median", "value": 15075.94}, {"year": 1991, "variable": "median", "value": 15075.94}, {"year": 1992, "variable": "median", "value": 15610.4}, {"year": 1993, "variable": "median", "value": 15690.77}, {"year": 1994, "variable": "median", "value": 16118.02}, {"year": 1995, "variable": "median", "value": 16650.16}, {"year": 1996, "variable": "median", "value": 17403.45}, {"year": 1997, "variable": "median", "value": 18277.43}, {"year": 1998, "variable": "median", "value": 19157.4}, {"year": 1999, "variable": "median", "value": 20102.35}, {"year": 2000, "variable": "median", "value": 20957.18}, {"year": 2001, "variable": "median", "value": 21767.29}, {"year": 2002, "variable": "median", "value": 22152.84}, {"year": 2003, "variable": "median", "value": 22576.71}, {"year": 2004, "variable": "median", "value": 23355.83}, {"year": 2005, "variable": "median", "value": 23962.2}, {"year": 2006, "variable": "median", "value": 24891.59}, {"year": 2007, "variable": "median", "value": 25737.2}, {"year": 2008, "variable": "median", "value": 26514.38}, {"year": 2009, "variable": "median", "value": 26261.29}, {"year": 2010, "variable": "median", "value": 26363.55}, {"year": 2011, "variable": "median", "value": 26965.43}, {"year": 2012, "variable": "median", "value": 27519.1}, {"year": 2013, "variable": "median", "value": 28031.02}, {"year": 2014, "variable": "median", "value": 28851.21}, {"year": 2015, "variable": "median", "value": 29930.13}, {"year": 2016, "variable": "median", "value": 30533.31}, {"year": 2017, "variable": "median", "value": 31561.49}, {"year": 2018, "variable": "median", "value": 32838.05}, {"year": 2019, "variable": "median", "value": 34248.45}, {"year": 1990, "variable": "mean", "value": 20923.84}, {"year": 1991, "variable": "mean", "value": 20923.84}, {"year": 1992, "variable": "mean", "value": 22001.92}, {"year": 1993, "variable": "mean", "value": 22191.14}, {"year": 1994, "variable": "mean", "value": 22786.73}, {"year": 1995, "variable": "mean", "value": 23700.11}, {"year": 1996, "variable": "mean", "value": 24859.17}, {"year": 1997, "variable": "mean", "value": 26309.73}, {"year": 1998, "variable": "mean", "value": 27686.75}, {"year": 1999, "variable": "mean", "value": 29229.69}, {"year": 2000, "variable": "mean", "value": 30846.09}, {"year": 2001, "variable": "mean", "value": 31581.97}, {"year": 2002, "variable": "mean", "value": 31898.7}, {"year": 2003, "variable": "mean", "value": 32678.48}, {"year": 2004, "variable": "mean", "value": 34197.63}, {"year": 2005, "variable": "mean", "value": 35448.93}, {"year": 2006, "variable": "mean", "value": 37078.27}, {"year": 2007, "variable": "mean", "value": 38760.95}, {"year": 2008, "variable": "mean", "value": 39652.61}, {"year": 2009, "variable": "mean", "value": 39054.62}, {"year": 2010, "variable": "mean", "value": 39959.3}, {"year": 2011, "variable": "mean", "value": 41211.36}, {"year": 2012, "variable": "mean", "value": 42498.21}, {"year": 2013, "variable": "mean", "value": 43041.39}, {"year": 2014, "variable": "mean", "value": 44569.2}, {"year": 2015, "variable": "mean", "value": 46119.78}, {"year": 2016, "variable": "mean", "value": 46640.94}, {"year": 2017, "variable": "mean", "value": 48251.57}, {"year": 2018, "variable": "mean", "value": 50000.44}, {"year": 2019, "variable": "mean", "value": 51916.27}]}}, {"mode": "vega-lite"});
</script>




```python
# Make a mapping of {year: dataframe} where the dataframe includes the entire
# chart of income levels. Again, once fetched, pickle the object locally to
# avoid unnecessary http requests. Please be familiar with security concerns
# when loading *untrusted* pickled data before running this block.

try:
    with open("income_dfs.pkl", "rb") as f:
        income_dfs = pickle.load(f)
except FileNotFoundError:
    income_dfs = {}
    for year in range(1990, 2020):
        tmp_df = pd.read_html(
            f"https://www.ssa.gov/cgi-bin/netcomp.cgi?year={year}"
        )[-2]
        tmp_df.columns = tmp_df.columns.droplevel()
        tmp_df[["Aggregate amount", "Average amount"]] = tmp_df[
            ["Aggregate amount", "Average amount"]
        ].apply(lambda x: x.str.lstrip("$").str.replace(",", "").astype(float))
        income_dfs[year] = tmp_df
    with open("income_dfs.pkl", "wb") as f:
        pickle.dump(income_dfs, f)
```


```python
# Give an idea of the shape of this data
income_dfs[2003].head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Net compensation interval</th>
      <th>Number</th>
      <th>Cumulativenumber</th>
      <th>Percentof total</th>
      <th>Aggregate amount</th>
      <th>Average amount</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>$0.01 — 4,999.99</td>
      <td>26312244</td>
      <td>26312244</td>
      <td>17.81198</td>
      <td>5.361136e+10</td>
      <td>2037.51</td>
    </tr>
    <tr>
      <th>1</th>
      <td>5,000.00 — 9,999.99</td>
      <td>15231616</td>
      <td>41543860</td>
      <td>28.12296</td>
      <td>1.125687e+11</td>
      <td>7390.46</td>
    </tr>
    <tr>
      <th>2</th>
      <td>10,000.00 — 14,999.99</td>
      <td>13262655</td>
      <td>54806515</td>
      <td>37.10107</td>
      <td>1.651411e+11</td>
      <td>12451.59</td>
    </tr>
    <tr>
      <th>3</th>
      <td>15,000.00 — 19,999.99</td>
      <td>12733058</td>
      <td>67539573</td>
      <td>45.72066</td>
      <td>2.225614e+11</td>
      <td>17479.02</td>
    </tr>
    <tr>
      <th>4</th>
      <td>20,000.00 — 24,999.99</td>
      <td>12034969</td>
      <td>79574542</td>
      <td>53.86769</td>
      <td>2.703204e+11</td>
      <td>22461.24</td>
    </tr>
  </tbody>
</table>
</div>




```python
# Show that the bins from 1997 - 2019 are the same, but differ than 1996 and
# earlier

(
    (
        income_dfs[1996]["Net compensation interval"].eq(
            income_dfs[1997]["Net compensation interval"]
        )
    ).all(),
    (
        income_dfs[1997]["Net compensation interval"].eq(
            income_dfs[2019]["Net compensation interval"]
        )
    ).all(),
)
```




    (False, True)




```python
# Filter out the $50,000,000 and greater column
more_than_50_mil = (
    pd.DataFrame(
        pd.concat(
            [income_dfs[y].iloc[-1, [0, 1]], pd.Series(y, index=["year"])]
        )
        for y in income_dfs.keys()
        if y > 1996
    )
    .set_index("year")
    .sort_index()
)
```


```python
chart = (
    alt.Chart(more_than_50_mil.reset_index())
    .mark_point()
    .encode(
        x="year:O",
        y="Number:Q",
    )
    .properties(title="# of income > $50,000,000 over time")
)

coef = (
    chart.transform_regression("year", "Number", params=True)
    .mark_text()
    .encode(
        x=alt.value(120),
        y=alt.value(50),
        text="coef:N",
    )
)

rSquared = (
    chart.transform_regression("year", "Number", params=True)
    .mark_text()
    .encode(
        x=alt.value(120),
        y=alt.value(75),
        text="rSquared:N",
    )
)
line = chart.transform_regression("year", "Number").mark_line()
(chart + coef + rSquared + line).interactive()
```





<div id="altair-viz-89dde0e7321a42239add91281dd522db"></div>
<script type="text/javascript">
  (function(spec, embedOpt){
    let outputDiv = document.currentScript.previousElementSibling;
    if (outputDiv.id !== "altair-viz-89dde0e7321a42239add91281dd522db") {
      outputDiv = document.getElementById("altair-viz-89dde0e7321a42239add91281dd522db");
    }
    const paths = {
      "vega": "https://cdn.jsdelivr.net/npm//vega@5?noext",
      "vega-lib": "https://cdn.jsdelivr.net/npm//vega-lib?noext",
      "vega-lite": "https://cdn.jsdelivr.net/npm//vega-lite@4.8.1?noext",
      "vega-embed": "https://cdn.jsdelivr.net/npm//vega-embed@6?noext",
    };

    function loadScript(lib) {
      return new Promise(function(resolve, reject) {
        var s = document.createElement('script');
        s.src = paths[lib];
        s.async = true;
        s.onload = () => resolve(paths[lib]);
        s.onerror = () => reject(`Error loading script: ${paths[lib]}`);
        document.getElementsByTagName("head")[0].appendChild(s);
      });
    }

    function showError(err) {
      outputDiv.innerHTML = `<div class="error" style="color:red;">${err}</div>`;
      throw err;
    }

    function displayChart(vegaEmbed) {
      vegaEmbed(outputDiv, spec, embedOpt)
        .catch(err => showError(`Javascript Error: ${err.message}<br>This usually means there's a typo in your chart specification. See the javascript console for the full traceback.`));
    }

    if(typeof define === "function" && define.amd) {
      requirejs.config({paths});
      require(["vega-embed"], displayChart, err => showError(`Error loading script: ${err.message}`));
    } else if (typeof vegaEmbed === "function") {
      displayChart(vegaEmbed);
    } else {
      loadScript("vega")
        .then(() => loadScript("vega-lite"))
        .then(() => loadScript("vega-embed"))
        .catch(showError)
        .then(() => displayChart(vegaEmbed));
    }
  })({"config": {"view": {"continuousWidth": 400, "continuousHeight": 300}}, "layer": [{"mark": "point", "encoding": {"x": {"type": "ordinal", "field": "year"}, "y": {"type": "quantitative", "field": "Number"}}, "selection": {"selector001": {"type": "interval", "bind": "scales", "encodings": ["x", "y"]}}, "title": "# of income > $50,000,000 over time"}, {"mark": "text", "encoding": {"text": {"type": "nominal", "field": "coef"}, "x": {"value": 120}, "y": {"value": 50}}, "title": "# of income > $50,000,000 over time", "transform": [{"on": "year", "regression": "Number", "params": true}]}, {"mark": "text", "encoding": {"text": {"type": "nominal", "field": "rSquared"}, "x": {"value": 120}, "y": {"value": 75}}, "title": "# of income > $50,000,000 over time", "transform": [{"on": "year", "regression": "Number", "params": true}]}, {"mark": "line", "encoding": {"x": {"type": "ordinal", "field": "year"}, "y": {"type": "quantitative", "field": "Number"}}, "title": "# of income > $50,000,000 over time", "transform": [{"on": "year", "regression": "Number"}]}], "data": {"name": "data-f2a985c5a0c9139b09a021a8d9804b7d"}, "$schema": "https://vega.github.io/schema/vega-lite/v4.8.1.json", "datasets": {"data-f2a985c5a0c9139b09a021a8d9804b7d": [{"year": 1997, "Net compensation interval": "50,000,000.00 and over", "Number": 13}, {"year": 1998, "Net compensation interval": "50,000,000.00 and over", "Number": 26}, {"year": 1999, "Net compensation interval": "50,000,000.00 and over", "Number": 87}, {"year": 2000, "Net compensation interval": "50,000,000.00 and over", "Number": 91}, {"year": 2001, "Net compensation interval": "50,000,000.00 and over", "Number": 58}, {"year": 2002, "Net compensation interval": "50,000,000.00 and over", "Number": 39}, {"year": 2003, "Net compensation interval": "50,000,000.00 and over", "Number": 32}, {"year": 2004, "Net compensation interval": "50,000,000.00 and over", "Number": 96}, {"year": 2005, "Net compensation interval": "50,000,000.00 and over", "Number": 102}, {"year": 2006, "Net compensation interval": "50,000,000.00 and over", "Number": 126}, {"year": 2007, "Net compensation interval": "50,000,000.00 and over", "Number": 151}, {"year": 2008, "Net compensation interval": "50,000,000.00 and over", "Number": 131}, {"year": 2009, "Net compensation interval": "50,000,000.00 and over", "Number": 72}, {"year": 2010, "Net compensation interval": "50,000,000.00 and over", "Number": 81}, {"year": 2011, "Net compensation interval": "50,000,000.00 and over", "Number": 93}, {"year": 2012, "Net compensation interval": "50,000,000.00 and over", "Number": 166}, {"year": 2013, "Net compensation interval": "50,000,000.00 and over", "Number": 110}, {"year": 2014, "Net compensation interval": "50,000,000.00 and over", "Number": 134}, {"year": 2015, "Net compensation interval": "50,000,000.00 and over", "Number": 202}, {"year": 2016, "Net compensation interval": "50,000,000.00 and over", "Number": 143}, {"year": 2017, "Net compensation interval": "50,000,000.00 and over", "Number": 205}, {"year": 2018, "Net compensation interval": "50,000,000.00 and over", "Number": 211}, {"year": 2019, "Net compensation interval": "50,000,000.00 and over", "Number": 222}]}}, {"mode": "vega-lite"});
</script>



The chart above shows the parameters for the regression, but they're a little hard
to read. The most pertinent seems like it would be the slope -- the number of
people per year that are moving into the >= $50,000,000 per year range. Lets
build a little convenience function to make the slope easily accessible.


```python
def get_slope(df: pd.DataFrame, column_name: str) -> float:
    """
    Returns the slope from a dataframe based on index and values from
    `column_name`
    >>> slope = pd.DataFrame({"A": [3, 5, 7]}).pipe(get_slope, "A")
    >>> np.isclose(slope, 2)
    True
    """
    lr = LinearRegression()
    lr.fit(
        df.index.values.reshape(-1, 1),
        df[column_name],
    )
    return lr.coef_[0]
```


```python
slope = more_than_50_mil.pipe(get_slope, "Number")
mean = more_than_50_mil["Number"].mean()
print(
    f"""{slope=:.2f}
Average number of people in this group: {mean:.2f}
Group is increasing by about: {slope / mean:.2%} per year"""
)
```

    slope=7.59
    Average number of people in this group: 112.65
    Group is increasing by about: 6.74% per year


Now lets look at the poorest of the poor.


```python
less_than_5k = (
    pd.DataFrame(
        pd.concat(
            [income_dfs[y].iloc[0, [0, 1]], pd.Series(y, index=["year"])]
        )
        for y in income_dfs.keys()
        if y > 1996
    )
    .set_index("year")
    .sort_index()
)
```


```python
chart = (
    alt.Chart(less_than_5k.reset_index())
    .mark_point()
    .encode(
        x="year:O",
        y="Number:Q",
    )
    .properties(title="Less than $5k")
)

coef = (
    chart.transform_regression("year", "Number", params=True)
    .mark_text()
    .encode(
        x=alt.value(120),
        y=alt.value(150),
        text="coef:N",
    )
)

rSquared = (
    chart.transform_regression("year", "Number", params=True)
    .mark_text()
    .encode(
        x=alt.value(120),
        y=alt.value(175),
        text="rSquared:N",
    )
)
line = chart.transform_regression("year", "Number").mark_line()
(chart + coef + rSquared + line).interactive()
```





<div id="altair-viz-3d4c6b3334404df980dac862ae56f55a"></div>
<script type="text/javascript">
  (function(spec, embedOpt){
    let outputDiv = document.currentScript.previousElementSibling;
    if (outputDiv.id !== "altair-viz-3d4c6b3334404df980dac862ae56f55a") {
      outputDiv = document.getElementById("altair-viz-3d4c6b3334404df980dac862ae56f55a");
    }
    const paths = {
      "vega": "https://cdn.jsdelivr.net/npm//vega@5?noext",
      "vega-lib": "https://cdn.jsdelivr.net/npm//vega-lib?noext",
      "vega-lite": "https://cdn.jsdelivr.net/npm//vega-lite@4.8.1?noext",
      "vega-embed": "https://cdn.jsdelivr.net/npm//vega-embed@6?noext",
    };

    function loadScript(lib) {
      return new Promise(function(resolve, reject) {
        var s = document.createElement('script');
        s.src = paths[lib];
        s.async = true;
        s.onload = () => resolve(paths[lib]);
        s.onerror = () => reject(`Error loading script: ${paths[lib]}`);
        document.getElementsByTagName("head")[0].appendChild(s);
      });
    }

    function showError(err) {
      outputDiv.innerHTML = `<div class="error" style="color:red;">${err}</div>`;
      throw err;
    }

    function displayChart(vegaEmbed) {
      vegaEmbed(outputDiv, spec, embedOpt)
        .catch(err => showError(`Javascript Error: ${err.message}<br>This usually means there's a typo in your chart specification. See the javascript console for the full traceback.`));
    }

    if(typeof define === "function" && define.amd) {
      requirejs.config({paths});
      require(["vega-embed"], displayChart, err => showError(`Error loading script: ${err.message}`));
    } else if (typeof vegaEmbed === "function") {
      displayChart(vegaEmbed);
    } else {
      loadScript("vega")
        .then(() => loadScript("vega-lite"))
        .then(() => loadScript("vega-embed"))
        .catch(showError)
        .then(() => displayChart(vegaEmbed));
    }
  })({"config": {"view": {"continuousWidth": 400, "continuousHeight": 300}}, "layer": [{"mark": "point", "encoding": {"x": {"type": "ordinal", "field": "year"}, "y": {"type": "quantitative", "field": "Number"}}, "selection": {"selector003": {"type": "interval", "bind": "scales", "encodings": ["x", "y"]}}, "title": "Less than $5k"}, {"mark": "text", "encoding": {"text": {"type": "nominal", "field": "coef"}, "x": {"value": 120}, "y": {"value": 150}}, "title": "Less than $5k", "transform": [{"on": "year", "regression": "Number", "params": true}]}, {"mark": "text", "encoding": {"text": {"type": "nominal", "field": "rSquared"}, "x": {"value": 120}, "y": {"value": 175}}, "title": "Less than $5k", "transform": [{"on": "year", "regression": "Number", "params": true}]}, {"mark": "line", "encoding": {"x": {"type": "ordinal", "field": "year"}, "y": {"type": "quantitative", "field": "Number"}}, "title": "Less than $5k", "transform": [{"on": "year", "regression": "Number"}]}], "data": {"name": "data-0443db874ff6dbcb96eb502fd513d050"}, "$schema": "https://vega.github.io/schema/vega-lite/v4.8.1.json", "datasets": {"data-0443db874ff6dbcb96eb502fd513d050": [{"year": 1997, "Net compensation interval": "$0.01 \u2014 4,999.99", "Number": 28733228}, {"year": 1998, "Net compensation interval": "$0.01 \u2014 4,999.99", "Number": 28122423}, {"year": 1999, "Net compensation interval": "$0.01 \u2014 4,999.99", "Number": 27575843}, {"year": 2000, "Net compensation interval": "$0.01 \u2014 4,999.99", "Number": 27394588}, {"year": 2001, "Net compensation interval": "$0.01 \u2014 4,999.99", "Number": 26817190}, {"year": 2002, "Net compensation interval": "$0.01 \u2014 4,999.99", "Number": 26662922}, {"year": 2003, "Net compensation interval": "$0.01 \u2014 4,999.99", "Number": 26312244}, {"year": 2004, "Net compensation interval": "$0.01 \u2014 4,999.99", "Number": 25949558}, {"year": 2005, "Net compensation interval": "$0.01 \u2014 4,999.99", "Number": 25800867}, {"year": 2006, "Net compensation interval": "$0.01 \u2014 4,999.99", "Number": 25600469}, {"year": 2007, "Net compensation interval": "$0.01 \u2014 4,999.99", "Number": 25233419}, {"year": 2008, "Net compensation interval": "$0.01 \u2014 4,999.99", "Number": 24596809}, {"year": 2009, "Net compensation interval": "$0.01 \u2014 4,999.99", "Number": 24315992}, {"year": 2010, "Net compensation interval": "$0.01 \u2014 4,999.99", "Number": 24124490}, {"year": 2011, "Net compensation interval": "$0.01 \u2014 4,999.99", "Number": 23548858}, {"year": 2012, "Net compensation interval": "$0.01 \u2014 4,999.99", "Number": 23303064}, {"year": 2013, "Net compensation interval": "$0.01 \u2014 4,999.99", "Number": 23115933}, {"year": 2014, "Net compensation interval": "$0.01 \u2014 4,999.99", "Number": 22574440}, {"year": 2015, "Net compensation interval": "$0.01 \u2014 4,999.99", "Number": 21998602}, {"year": 2016, "Net compensation interval": "$0.01 \u2014 4,999.99", "Number": 21816123}, {"year": 2017, "Net compensation interval": "$0.01 \u2014 4,999.99", "Number": 21445269}, {"year": 2018, "Net compensation interval": "$0.01 \u2014 4,999.99", "Number": 20912646}, {"year": 2019, "Net compensation interval": "$0.01 \u2014 4,999.99", "Number": 20180756}]}}, {"mode": "vega-lite"});
</script>




```python
slope = less_than_5k.pipe(get_slope, "Number")
mean = less_than_5k["Number"].mean()
print(
    f"""{slope=:.2f}
Average number of people in this group: {mean:.2f}
Group is decreasing by about: {-slope / mean:.2%} per year"""
)
```

    slope=-357146.05
    Average number of people in this group: 24614597.09
    Group is decreasing by about: 1.45% per year



```python
income_dfs[2019].iloc[-1]["Average amount"] / income_dfs[2019].iloc[0][
    "Average amount"
]
```




    42460.35824745949



## Summary

The SSA provides some interesting an accessible data on income in the US. The
median income reported by the SSA is *way* lower than I thought it was, and
much lower than the household-level data reported by the census.

The number of Americans making more than $50 million per year is low, and is
increasing by about 6% per year (small denominator, this is less than 8
people). Each of them make as much per year as about 42,000 people in the
lowest bracket combined. The count of people in the lowest bracket is
decreasing by less than 2% per year. Hpefully this represents improvement in
their standard of living, though I suppose it could also be people dropping out
of the workforce completely.
