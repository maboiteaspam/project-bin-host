# project-bin-host

Manage per project host file.

Compatible windows / linux / macos, see below.

On windows it flush the cache and run UAC query.

On linux / macos it will require ```sudo``` and root permissions.

## Install

```
npm i project-bin-host -g
```

## Usage

Description
```
  Usage: project-host [options] [command]


  Commands:

    load [options] [file]    Load given file into your system. file=.hostile
    unload [options] [file]  Unload given file from your system. file=.hostile
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


## Host File

Add ```.hostile``` file at root folder of your project.

```
# .hostile
# npm i project-bin-host -g
# project-host load

4.4.4.4 dns1.google.com
8.8.8.8 dns2.google.com

xxx.xxx.xxx.xxx you.owndns.com
```


##### Windows

Windows can t be automated using this software as it will throw an UAC query.

The user must then click yes / no.

If you d like to automate a process under windows that requires administrator privileges, 

please check

```
runas /profile /USERNAME:Administrator WHATVEVER.cmd
```

And https://github.com/feross/hostile

Note also that because of the clunky nature of the solution to trigger UAC, it is not possible to get standard input / output feed from rooted process.

This means it is not possible to provide user feedback about command completion success or failure. : /

#### Linux

Please run the command with sudo.

## Tests

There are no tests as i don t know how to do with that UAC stuff.
