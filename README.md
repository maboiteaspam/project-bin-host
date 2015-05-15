# project-bin-host

Help to manage per project host file.

Compatible both windows / linux, see below.

It will also flush your host cache when ran under windows.

## Install

```
npm i project-host -g
```

## Usage

Description
```
  Usage: bin [options] [command]


  Commands:

    load [options] [file]    Load given file into your system. file=.hostile
    unload [options] [file]  Unload given file into your system. file=.hostile
    *                        Help

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

```

Load file of entries

```
project-host load hostfile.txt
```

Unload file of entries
```
project-host unload hostfile.txt
```


##### Host File

.hostile

```
# hostile file
# npm i project-bin-host -g
# project-host load

4.4.4.4 dns1.google.com
8.8.8.8 dns2.google.com
```

##### Windows

Windows can t be automated using this software as it will throw an UAC query.

The user must then click yes / no.

If you d like to automate a process under windows that requires administrator privileges, please check

```
runas /profile /USERNAME:Administrator WHATVEVER.cmd
```

Note also that because of the clunky nature of the solution to trigger UAC, it is not possible to get standard input / output feed from rooted process.

This means it is not possible to provide user feedback about command completion success or failure. : /

#### Linux

Please run the command with sudo.

## Tests

There are no tests as i don t know how to do with that UAC stuff.
