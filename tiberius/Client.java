package Tiberius;

import java.io.*;
import java.net.Socket;

public class Client {
    public static void main(String[] args) throws IOException{
        Socket Server = new Socket("127.0.0.1", 55555);
        System.out.println("Connected");
        class recive extends Thread{
            @Override
            public void run(){
                while (true){
                    try {
                        String text = new BufferedReader( new InputStreamReader(Server.getInputStream())).readLine();
                        if(text!=""){
                            System.out.println(text);
                        }
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                }
            }
        }
        class send extends Thread{
            @Override
            public void run() {
                while (true){
                    try {
                        String text = new BufferedReader(new InputStreamReader(System.in)).readLine();
                        if(text!=""){
                            PrintWriter out = new PrintWriter(new OutputStreamWriter(Server.getOutputStream()), true);
                            out.println(text);
                        }
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                }
            }
        }
        recive t1 = new recive();
        send t2 = new send();
        t1.start();
        t2.start();
    }
}